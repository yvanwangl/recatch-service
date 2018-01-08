import { Path, GET, POST, PathParam, BodyParam, CtxParam } from 'iwinter';
import User from '../models/User';
import { userLoginAuth, userAdminLoginAuth } from '../auth';
import { buildResponse } from '../utils';

@Path('/api/users')
class UserController {

    /**
     * 获取登录用户信息，邮箱等
     */
    @GET
    @Path('/', userLoginAuth)
    async getUserInfo( @CtxParam('ctx') ctx: any) {
        let { userId } = ctx.session.userInfo;
        let user = await User.findById(userId);
        return buildResponse(null, {_id: user._id, username: user.username, email: user.email});
    }

    /**
     * 设置用户邮箱
     * @param id 
     */
    @POST
    @Path('/email', userLoginAuth)
    async getUserById( @BodyParam('emailInfo') emailInfo: any, @CtxParam('ctx') ctx: any) {
        let { email } = emailInfo;
        let { userId } = ctx.session.userInfo;
        let result = await User.findByIdAndUpdate(userId, { $set: { email } }, { new: true });
        return buildResponse(null, {_id: result._id, username: result.username, email: result.email});
    }

    /**
     * 生成注册码
     * 只有超级管理员可以访问
     */
    @GET
    @Path('/gen-registor-code', userAdminLoginAuth)
    genRegistorCode(){
        return 'comming soon...';
    }
}

export default UserController;