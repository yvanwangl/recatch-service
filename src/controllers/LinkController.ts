import { Path, GET, POST, PUT, BodyParam, CtxParam, PathParam } from 'iwinter';
import Email from '../email';
import Link from '../models/Link';
import { userAdminLoginAuth } from '../auth';
import User from '../models/User';
import { buildResponse } from '../utils';

@Path('/api/links')
class LinkController {

    /**
     * 查询所有审核通过的友链
     */
    @GET
    @Path('/')
    async getAllLinks() {
        let links = await Link.find({ status: 'Valid' });
        return buildResponse(null, links);
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
        //有友链申请时向超级管理员邮箱发送邮件
        let users = await User.find({ admin: true });
        if (users.length > 0 && users[0].email) {
            this.sendEmail(
                users[0].email,
                '友链申请',
                `收到新的友链申请:<br/><br/> 
                ${result.name}<br/>
                ${result.description}<br/>
                <a href='${result.link}' target='_blank'>${result.link}</a><br/><br/> 
                <a href='https://admin.yvanwang.com' target='_blank'>前往审核</a>`
            );
        }
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
        return buildResponse(null, links);
    }


    /**
     * 只有超级管理员才有权限对友链进行审核
     */
    @PUT
    @Path('/:linkId', userAdminLoginAuth)
    async auditLink( @PathParam('linkId') linkId: any, @BodyParam('link') link: any) {
        let result = await Link.findByIdAndUpdate(linkId, { $set: link }, { new: true });
        //友链审核结果给用户邮箱发邮件
        let subject = '', content = '';
        switch (result.status) {
            case 'Valid':
                subject = '友链审核通过';
                content = '您的友链申请审核通过啦，<br/><br/><a href="https://www.yvanwang.com/links">前往查看吧</a>';
                break;
            case 'Invalid':
                subject = '友链审核失败';
                content = `您的友链申请审核未通过，审核失败原因为：<br/><br/>${result.reason}<br/><br/><a href="https://www.yvanwang.com/links">提交新申请</a>`;
                break;
        }
        this.sendEmail(result.email, subject, content);
        return buildResponse(null, result);
    }

    /**
     * 发送邮件
     * @param target 收件箱
     * @param subject 邮件主题
     * @param content 邮件内容
     */
    sendEmail(target: string, subject: string, content: string) {
        //收件箱存在则发送
        if (target) {
            let email = new Email();
            email.sendMail({
                target,
                subject,
                html: content
            });
        }
    }

}

export default LinkController;