import { Path, GET, POST, DELETE, CtxParam, BodyParam, PathParam } from 'iwinter';
import Post from '../models/Post';
import Comment from '../models/Comment';
import { userLoginAuth } from '../auth';
import { buildResponse } from '../utils';

@Path('/api/comments')
class CommentController {

    /**
     * 查询当前用户下所有博客列表的评论
     * @param ctx
     */
    @Path('/get-by-user', userLoginAuth)
    @GET
    async getCommentsByUser( @CtxParam('ctx') ctx: any) {
        let { userId } = ctx.session.userInfo;
        let posts = await Post.findByUserId(userId);
        let comments = await posts.reduce(async (commentsP, post) => {
            let commentsByPostId = await Comment.findByPostId(post['_id']);
            let comments = await commentsP;
            return comments.concat(commentsByPostId);
        }, Promise.resolve([]));
        return buildResponse(null, comments);
    }

    /**
     * 新增评论
     */
    @Path('/')
    @POST
    async addComment( @BodyParam('comment') comment: any) {
        let newComment = new Comment(comment);
        let result = await newComment.save();
        return buildResponse(null, result);
    }

    /**
     * 删除评论
     */
    @Path('/:commentId', userLoginAuth)
    @DELETE
    async deleteComment( @PathParam('commentId') commentId: string) {
        let result = await Comment.findByIdAndRemove(commentId);
        return buildResponse(null, { _id: commentId });
    }

}

export default CommentController;