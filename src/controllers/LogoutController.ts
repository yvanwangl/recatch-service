import { POST, Path, CtxParam } from 'iwinter';
import { buildResponse } from '../utils';

@Path('/api/logout')
class LogoutController {

    /**
     * 用户登出，删除 session 信息
     * @param ctx
     */
    @Path('/')
    @POST
    logout( @CtxParam('ctx') ctx: any) {
        let { username } = ctx.session.userInfo;
        ctx.session.userInfo = null;
        return buildResponse(null, { username });
    }

}

export default LogoutController;