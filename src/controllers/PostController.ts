// import {RequestMapping} from '../decorators/requestMapping';
// import {httpGet, httpPost} from '../decorators/http-methods';
// import {path} from '../decorators/path';
import { Path, GET, POST, PUT, DELETE, BodyParam, CtxParam, PathParam } from 'iwinter';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Label from '../models/Label';
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
        let postList = await Promise.all(posts.map(async (post) => {
            let commentsByPostId = await Comment.findByPostId(post['_id']);
            post['comments'] = commentsByPostId.map(comment => comment['_id']);
            return post;
        }));
        let labels = await Label.findByUserId(userId);

        return buildResponse(null, {posts: postList, labels});
    }

    /**
     * 新增博客文章
     */
    @POST
    @Path('/', userLoginAuth)
    async addPost( @CtxParam('ctx') ctx: any, @BodyParam('post') post: any) {
        let { userId, username } = ctx.session.userInfo;
        //设置创建人 和 创建时间
        Object.assign(post, {
            userId,
            userName: username,
            publishDate: new Date()
        });
        let newPost = new Post(post);
        let result = await newPost.save();
        return buildResponse(null, result);
    }

    /**
     * 修改博客文章
     */
    @PUT
    @Path('/:postId', userLoginAuth)
    async modifyPost( @PathParam('postId') postId: any, @BodyParam('post') post: any) {
        //如果更新发布时间，则重置 publishData 为当前时间
        if (post.updateDate) {
            post.publishDate = new Date();
        }
        let result = await Post.findByIdAndUpdate(postId, { $set: post }, { new: true });
        return buildResponse(null, result);
    }

    /**
     * 删除博客文章,则 置博客的状态为： postStatus: Invaild
     */
    @DELETE
    @Path('/:postId', userLoginAuth)
    async deletePost( @PathParam('postId') postId: any) {
        let result = await Post.findByIdAndUpdate(postId, { $set: { postStatus: 'Invaild' } }, { new: true });
        return buildResponse(null, { _id: postId });
    }
}

export default PostController;