import { POST, Path, BodyParam, CtxParam } from 'iwinter';
import User from '../models/User';
import { genSalt, buildResponse } from '../utils';
import { userInfo } from 'os';
import config from '../config';
const md5 = require('blueimp-md5');
const { registor } = config;

export interface LonginInfo {
    type?: string;
    username: string;
    password: string;
}

@Path('/api/login')
class LoginController {

    /**
     * 用户 登录 或 注册 接口
     * @param loginInfo: LoginInfo
     * @param ctx: any -> koa 上下文对象
     */
    @POST
    @Path('/')
    doLogin( @BodyParam('loginInfo') loginInfo: LonginInfo, @CtxParam('ctx') ctx: any) {
        let type = loginInfo['type'];
        //登录
        if (type == 'signin') {
            return this.signin(loginInfo, ctx);
        } else {
            //判断是否开放注册接口
            console.log(registor);
            if (registor) {
                return this.signup(loginInfo, ctx);
            } else {
                return buildResponse('Comming Soon ...');
            }
        }
    }

    /**
     * 判断用户名是否已经存在
     * @param loginInfo 
     */
    @POST
    @Path('/validate-username')
    async validateUsername( @BodyParam('loginInfo') loginInfo: LonginInfo) {
        let username = loginInfo['username'];
        let users = await User.findByUsername(username);
        if (users.length > 0) {
            return buildResponse('username.exist');
        }
        return buildResponse(null, username);
    }

    /**
     * 用户登录，登录成功记入 session
     * @param { username, password }: loginInfo
     * @param ctx
     */
    private async signin({ username, password }: LonginInfo, ctx: any) {
        let users = await User.findByUsername(username);
        if (users.length != 1) {
            return buildResponse('username.or.password.error');
        }
        let { _id, salt, password: confirmPwd, admin } = users[0];
        //判断密码是否正确
        if (md5(password, salt) != confirmPwd) {
            return buildResponse('username.or.password.error');
        }
        //登录成功，写入 session
        let userInfo = { userId: _id, username, admin };
        ctx.session.userInfo = userInfo;
        return buildResponse(null, userInfo);
    }

    /**
     * 用户注册
     * @param {username, password}
     */
    private async signup({ username, password }: LonginInfo, ctx: any) {
        let salt = genSalt();
        let newUser = new User({
            username,
            password: md5(password, salt),
            salt,
            admin: false
        });
        let result = await newUser.save();
        if (result.errors) {
            return buildResponse('fail');
        }
        //调用登录方法，注册完成直接登录
        return await this.signin({ username, password }, ctx);
    }

}

export default LoginController;