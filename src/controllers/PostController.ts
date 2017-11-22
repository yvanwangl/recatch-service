// import {RequestMapping} from '../decorators/requestMapping';
// import {httpGet, httpPost} from '../decorators/http-methods';
// import {path} from '../decorators/path';
import { Path, GET, POST, BodyParam, CtxParam } from 'iwinter';
import Post from '../models/Post';
import { userLoginAuth } from '../auth';
import { buildResponse } from '../utils';

@Path('/api/posts')
class PostController {

    /**
     * 查询所有文章
     */
    @GET
    @Path('/')
    getAllPosts() {

        return [{
            id: 0, content: 'test', author: 'test', comments: []
        }];
    }

    /**
     * 查询当前登录用户的文章
     * @param ctx 
     */
    @GET
    @Path('/get-by-user', userLoginAuth)
    async getPostsByUser( @CtxParam('ctx') ctx: any) {
        let { userId } = ctx.session.userInfo;
        let posts = await Post.findByUserId(userId);
        return buildResponse(null, posts);
    }

    @POST
    @Path('/add')
    async addPost(post) {
        let newPost = new Post(post);
        let result = await newPost.save();
        return result;
    }
}

export default PostController;