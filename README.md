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

`2.`部署 docker 容器：</br>
首先构建 docker 镜像，需要在项目根目录下运行：`docker build --rm -f Dockerfile -t recatch-service:latest .`</br>
然后运行容器：`docker run -d -p 8082:8082 --name recatch-service recatch-service:latest`</br>
-p  将容器内部的网络端口映射到我们使用的宿主机上    第一个 8082 为宿主机端口    第二个 8082 为容器端口</br>

由于该项目采用前后端分离的方式进行开发，该项目为后端部分，所以还需要部署前端服务项目 [recatch](https://github.com/yvanwangl/recatch) [recatch-ui](https://github.com/yvanwangl/recatch-ui)

> 欢迎Star，有问题请提 issue :)
