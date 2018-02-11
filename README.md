## 博客项目第二版后端代码 代号 recatch-service

该项目作为博客的后端代码，主要为 recatch 及 recatch-ui 提供数据接口。</br>
使用 Koa 框架，用 Typescript 进行编写，使用 [IWinter](https://github.com/yvanwangl/iwinter) 进行路由转控制器的处理。</br>
IWinter 基于 Typescript 的装饰器功能，路由编写更清晰！</br>

## 路由编写
`1.` 基于 Iwinter 进行 控制器 及 路径 级别的权限控制更清晰 :)</br>
`2.` 使用 async/await 进行异步代码的编写更舒服 :)</br>
```
import { POST, GET, PUT, DELETE, Path, CtxParam, BodyParam, PathParam } from 'iwinter';
import Label from '../models/Label';
import { userLoginAuth } from '../auth';
import { buildResponse } from '../utils';

@Path('/api/labels', userLoginAuth)
class LabelController {

    /**
     * 根据用户查询标签
     */
    @Path('/get-by-user')
    @GET
    async getLabelsByUser( @CtxParam('ctx') ctx: any) {
        let { userId } = ctx.session.userInfo;
        let labels = await Label.findByUserId(userId);
        return buildResponse(null, labels);
    }

    /**
     * 增加标签
     */
    @Path('/')
    @POST
    async addLabel( @CtxParam('ctx') ctx: any, @BodyParam('label') label: any) {
        let { userId } = ctx.session.userInfo;
        label['userId'] = userId;
        let newLabel = new Label(label);
        let result = await newLabel.save();
        return buildResponse(null, result);
    }

    /**
    * 修改标签
    */
    @Path('/:id')
    @PUT
    async modifyLabel( @PathParam('id') id: any, @BodyParam('label') label: any, @CtxParam('ctx') ctx: any) {
        let { userId } = ctx.session.userInfo;
        label['userId'] = userId;
        let result = await Label.findByIdAndUpdate(id, { $set: label }, { new: true });
        return buildResponse(null, result);
    }


    /**
    * 删除标签
    */
    @Path('/:id')
    @DELETE
    async deleteLabel( @PathParam('id') id: any) {
        let result = await Label.findByIdAndRemove(id);
        return buildResponse(null, { _id: id});
    }
}

export default LabelController;
```


### 如何运行
`1.` `git clone https://github.com/yvanwangl/recatch-service.git`</br>
`2.` `cd recatch-service && npm install`</br>
`3.` `npm run start`</br>

### 项目构建
`1.` 通过 `npm run build` 进行项目构建</br>

### 项目部署
该项目支持两种部署方式：</br>
`1.` 基于node环境部署：`npm run start:prod`</br>
注意：  运行前需要对环境变量进行配置</br>
该方式的部署需要修改根目录下的 `ecosystem.config.js` 文件</br>
```
env_production: {
    "PORT": 8082,
    "NODE_ENV": "production",
    "MONGODB_HOST": '',
    "MONGODB_DATABASE":'',
    "MONGODB_PORT":'',
    "MONGODB_USER":'',
    "MONGODB_PWD":'',
    "SERVER_HOST":'',
    "QINIU_DOUPLOAD":'',
    "QINIU_PUBLIC_BUCKET_DOMAIN":'',
    "QINIU_ACCESS_KEY":'',
    "QINIU_SECRET_KEY":'',
    "QINIU_BUCKET":'',
    "EMAIL_HOST":'',
    "EMAIL_PORT":'',
    "EMAIL_USER":'',
    "EMAIL_PASS":'',
    "REGISTOR":''
}
```

`2.`部署 docker 容器：</br>
首先构建 docker 镜像，需要在项目根目录下运行：`docker build --rm -f Dockerfile -t recatch-service:latest .`</br>
然后使用 docker-compose 运行容器：`docker-compose up -d`</br>
注意：  运行前需要对环境变量进行配置</br>
该方式的部署需要修改根目录下的 `docker-compose.yml` 文件</br>
```
environment:
  - MONGODB_PWD=
  - EMAIL_PASS=
  - QINIU_BUCKET=
  - MONGODB_PORT=
  - SERVER_HOST=
  - QINIU_DOUPLOAD=
  - REGISTOR=
  - QINIU_SECRET_KEY=
  - QINIU_ACCESS_KEY=
  - MONGODB_USER=
  - QINIU_PUBLIC_BUCKET_DOMAIN=
  - EMAIL_PORT=
  - EMAIL_HOST=
  - EMAIL_USER=
  - MONGODB_DATABASE=
  - MONGODB_HOST=
```

### 配置参数说明：</br>
PORT：服务端口号</br>
NODE_ENV：环境变量</br>
MONGODB_HOST：Mongo 服务器地址，本机为 localhost / 127.0.0.1</br>
MONGODB_PORT：Mongo 服务器端口，默认为 27017</br>
MONGODB_DATABASE: Mongo 数据库名称</br>
MONGODB_USER：Mongo 数据库用户名，没有默认为 ''</br>
MONGODB_PWD：Mongo 数据库密码，没有默认为 ''</br>
SERVER_HOST：服务器地址，主要为上传图片时返回图片 url 拼接使用</br>
QINIU_DOUPLOAD：参数配置，是否上传图片到七牛，如果该项配置为 false ,则其他的 QINIU_* 均不需配置</br>
QINIU_PUBLIC_BUCKET_DOMAIN：七牛存储空间的外链默认域名</br>
QINIU_ACCESS_KEY: 七牛个人的两对密钥(Access/Secret Key)</br>
QINIU_SECRET_KEY: 七牛个人的两对密钥(Access/Secret Key)</br>
QINIU_BUCKET: 七牛存储空间名称</br>
EMAIL_HOST: 发送邮件服务器 ，如果使用腾讯邮箱，则为 smtp.qq.com</br>
EMAIL_PORT：发送邮件服务器端口</br>
EMAIL_USER: 发送邮件的用户，为个人邮箱</br>
EMAIL_PASS：发送邮件的验证密码，具体设置参考 [使用 Node.js 的 nodemailer 模块发送邮件（支持 QQ、163 等、支持附件）](http://www.lovebxm.com/2017/07/21/node-mail/)</br>
REGISTOR: 是否开放注册功能

由于该项目采用前后端分离的方式进行开发，该项目为后端部分，所以还需要部署前端服务项目 [recatch](https://github.com/yvanwangl/recatch) [recatch-ui](https://github.com/yvanwangl/recatch-ui)

> 欢迎Star，有问题请提 issue :)
