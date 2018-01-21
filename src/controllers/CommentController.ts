import { Path, GET, POST, DELETE, CtxParam, BodyParam, PathParam } from 'iwinter';
import Email from '../email';
import Post from '../models/Post';
import Comment from '../models/Comment';
import User from '../models/User';
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
            commentsByPostId.map(comment => comment['postName'] = post.title);
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
        //新增评论成功，发送邮件
        this.sendEmail(result.postId, result.commentContent);
        return buildResponse(null, result);
    }

    /**
     * 删除评论，需要迭代删除所有子评论
     */
    @Path('/:commentId', userLoginAuth)
    @DELETE
    async deleteComment( @PathParam('commentId') commentId: string) {
        let result = await Comment.findByIdAndRemove(commentId);
        let childComments = await Comment.findByParentId(commentId);
        let commentIds = await Promise.all(childComments.map(async (comment) => {
            await comment.remove();
            return comment['_id'];
        }));
        commentIds.push(commentId);
        return buildResponse(null, { commentIds });
    }

    /**
     * 发送邮件
     */
    async sendEmail(postId: string, commentContent: string) {
        let post = await Post.findById(postId);
        let user = await User.findById(post.userId);
        //用户配置邮件则发送
        if (user.email) {
            let email = new Email();
            email.sendMail({
                target: user.email,
                subject: `博客 《 ${post.title} 》 收到新评论`,
                html: ` ${post.title} 收到新评论:<br/><br/> ${commentContent} <br/><br/> <a href='https://www.yvanwang.com/${postId}' target='_blank'>快去查看吧!</a>`
            });
        }
    }

}

export default CommentController;