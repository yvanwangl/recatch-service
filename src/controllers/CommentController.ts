import { Path, GET, POST, CtxParam, BodyParam } from 'iwinter';
import Post from '../models/Post';
import Comment from '../models/Comment';
import { buildResponse } from '../utils';

@Path('/api/comments')
class CommentController {

    /**
     * 查询当前用户下所有博客列表的评论
     * @param ctx
     */
    @Path('/get-by-user')
    @GET
    async getCommentsByUser( @CtxParam('ctx') ctx: any) {
        let { userId } = ctx.session.userInfo;
        let posts = await Post.findByUserId(userId);
        let comments = posts.reduce(async (comments, post) => {
            let commentsByPostId = await Comment.findByPostId(post['_id']);
            return comments.concat(commentsByPostId);
        }, []);
        return buildResponse(null, comments);
    }

    /**
     * 新增评论
     */
    @Path('/')
    @POST
    async addComment( @BodyParam('comment') comment: any) {
        let newComment = Comment.create();
        
    }

}

export default CommentController;