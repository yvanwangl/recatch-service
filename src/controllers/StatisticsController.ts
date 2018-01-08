import { Path, GET, CtxParam } from 'iwinter';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Label from '../models/Label';
import Project from '../models/Project';
import Link from '../models/Link';
import { userLoginAuth } from '../auth';
import { buildResponse } from '../utils';

@Path('/api/statistics', userLoginAuth)
class StatisticsController {

    /**
     * 查询统计信息
     */
    @GET
    @Path('/')
    async getStatistics( @CtxParam('ctx') ctx: any) {
        let { userId, admin } = ctx.session.userInfo;
        let posts = await Post.findByUserId(userId);
        let pageViewCount = posts.reduce((viewCount, post) => viewCount += post.count, 0);
        let commentCount = await posts.reduce(async (commentCount, post) => {
            let comments = await Comment.count({ postId: post['_id'] });
            let commentTotal = await commentCount;
            return comments + commentTotal;
        }, Promise.resolve(0));
        let labelCount = await Label.count({ userId });
        let projectCount = await Project.count({ userId });
        let validLinkCount = 0;
        let invalidLinkCount = 0;
        let reviewLinkCount = 0;
        if(admin) {
            validLinkCount = await Link.count({status: 'Valid'});
            invalidLinkCount = await Link.count({status: 'Invalid'});
            reviewLinkCount = await Link.count({status: 'Review'});
        }
        return buildResponse(null, { postCount: posts.length, commentCount, labelCount, projectCount, pageViewCount, validLinkCount, invalidLinkCount, reviewLinkCount });
    }
}

export default StatisticsController;