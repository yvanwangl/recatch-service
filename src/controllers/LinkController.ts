import { Path, GET, POST, BodyParam, CtxParam, PathParam } from 'iwinter';
import Link from '../models/Link';
import { userAdminLoginAuth } from '../auth';
import { buildResponse } from '../utils';

@Path('/api/projects')
class LinkController {

    /**
     * 查询所有审核通过的友链
     */
    @GET
    @Path('/')
    async getAllLinks() {
        let links = await Link.find({status: 'Valid'});
        return buildResponse(null, { links });
    }

    /**
     * 新增友链, 在博客前台页面增加，初始状态为待审核 'Review'
     */
    @POST
    @Path('/')
    async addLink( @CtxParam('ctx') ctx: any, @BodyParam('link') link: any) {
        
        //设置创建人 和 创建时间
        Object.assign(link, {
            status: 'Review'
        });
        let newLink = new Link(link);
        let result = await newLink.save();
        return buildResponse(null, result);
    }


    /**
    * 只有超级管理员才有权限查询友链
    * 查询当前登录用户的项目
    * @param ctx 
    */
    @GET
    @Path('/get-by-user', userAdminLoginAuth)
    async getPostsByUser( @CtxParam('ctx') ctx: any) {
        let links = await Link.find({});
        return buildResponse(null, { links });
    }


    /**
     * 只有超级管理员才有权限对友链进行审核
     */
    @POST
    @Path('/:linkId', userAdminLoginAuth)
    async reviewLink( @PathParam('linkId') linkId: any, @BodyParam('link') link: any) {
        let result = await Link.findByIdAndUpdate(linkId, { $set: link }, { new: true });
        return buildResponse(null, result);
    }

}

export default LinkController;