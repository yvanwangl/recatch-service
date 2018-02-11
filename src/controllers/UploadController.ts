import { Path, POST, BodyParam, CtxParam } from 'iwinter';
import * as fs from 'mz/fs';
import * as path from 'path';
import * as formidable from 'formidable';
import * as qiniu from 'qiniu';
import config from '../config';
import { userLoginAuth } from '../auth';
import { buildResponse } from '../utils';

@Path('/api/upload', userLoginAuth)
class UploadController {

    @POST
    @Path('/')
    async upload( @BodyParam('formData') formData: any, @CtxParam('ctx') ctx: any) {
        //139.224.195.74
        let { server: { host, port }, qiniu: { doUpload, publicBucketDomain, accessKey, secretKey, bucket } } = config;
        // 文件将要上传到哪个文件夹下面
        let uploadfoldername = 'uploadfiles';
        let uploadfolderpath = path.join(__dirname, '../../public', uploadfoldername);
        // 使用第三方的 formidable 插件初始化一个 form 对象
        let form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, '../../', 'tmp');
        let result = await new Promise(function (resolve, reject) {
            form.parse(ctx.req, function (err, fields, files) {
                if (err) {
                    return console.log('formidable, form.parse err');
                }

                let item;
                // 计算 files 长度
                let length = 0;
                for (item in files) {
                    length++;
                }
                if (length === 0) {
                    return console.log('files no data');
                }

                for (item in files) {
                    let Froala = item === 'FroalaImg';
                    let file = files[item];
                    // formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
                    let tempfilepath = file.path;
                    // 获取文件类型
                    let type = file.type;

                    // 获取文件名，并根据文件名获取扩展名
                    let filename = file.name;
                    let extname = filename.lastIndexOf('.') >= 0
                        ? filename.slice(filename.lastIndexOf('.') - filename.length)
                        : '';
                    // 文件名没有扩展名时候，则从文件类型中取扩展名
                    if (extname === '' && type.indexOf('/') >= 0) {
                        extname = '.' + type.split('/')[1];
                    }
                    // 将文件名重新赋值为一个随机数（避免文件重名）
                    filename = Math.random().toString().slice(2) + extname;

                    // 构建将要存储的文件的路径
                    let filenewpath = path.join(uploadfolderpath, filename);

                    // 将临时文件保存为正式的文件
                    fs.rename(tempfilepath, filenewpath, function (err) {
                        // 存储结果
                        let result = '';
                        console.log(tempfilepath);
                        console.log(filenewpath);

                        if (err) {
                            // 发生错误
                            console.log(err);
                            console.log('fs.rename err');
                            result = 'error|save error';
                        } else {
                            // 保存成功
                            console.log('fs.rename done');
                            if (doUpload) {
                                //上传图片到七牛
                                let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
                                let options = {
                                    scope: `${bucket}:${filename}`,
                                };
                                let putPolicy = new qiniu.rs.PutPolicy(options);
                                let uploadToken = putPolicy.uploadToken(mac);

                                var config = new qiniu.conf.Config() as any;
                                // 空间对应的机房: 华东
                                config.zone = qiniu.zone.Zone_z0;
                                var localFile = filenewpath;
                                var formUploader = new qiniu.form_up.FormUploader(config);
                                var putExtra = new qiniu.form_up.PutExtra();
                                var key = filename;
                                // 文件上传
                                formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
                                    respBody, respInfo) {
                                    if (respErr) {
                                        throw respErr;
                                    }

                                    if (respInfo.statusCode == 200) {
                                        console.log(respBody);
                                        var bucketManager = new qiniu.rs.BucketManager(mac, config);
                                        // 公开空间访问链接
                                        var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
                                        console.log(publicDownloadUrl);
                                        //如果为 Froala 上传图片， 则响应对象结构为 {link: 'image/path'}
                                        if (Froala) {
                                            resolve({ link: publicDownloadUrl });
                                        }
                                        resolve(buildResponse(null, publicDownloadUrl));
                                    } else {
                                        console.log(respInfo.statusCode);
                                        console.log(respBody);
                                    }
                                });
                            } else {
                                // 拼接图片url地址
                                let localDownloadUrl = `http://${host}:${port}/${uploadfoldername}/${filename}`;
                                //如果为 Froala 上传图片， 则响应对象结构为 {link: 'image/path'}
                                if (Froala) {
                                    resolve({ link: localDownloadUrl });
                                }
                                resolve(buildResponse(null, localDownloadUrl));
                            }



                        }
                    });
                }
            });
        });
        return result;
    }
}

export default UploadController;