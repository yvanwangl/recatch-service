import { POST, GET, PUT, DELETE, Path, CtxParam, BodyParam, PathParam } from 'iwinter';
import Label from '../models/Label';
import { userLoginAuth } from '../auth';
import { buildResponse } from '../utils';

@Path('/api/labels', userLoginAuth)
class LabelController {

    /**
     * 根据用户查询标签
     */
    @Path('/get-by-user')
    @GET
    async getLabelsByUser( @CtxParam('ctx') ctx: any) {
        let { userId } = ctx.session.userInfo;
        let labels = await Label.findByUserId(userId);
        return buildResponse(null, labels);
    }

    /**
     * 增加标签
     */
    @Path('/')
    @POST
    async addLabel( @CtxParam('ctx') ctx: any, @BodyParam('label') label: any) {
        let { userId } = ctx.session.userInfo;
        label['userId'] = userId;
        let newLabel = new Label(label);
        let result = await newLabel.save();
        return buildResponse(null, result);
    }

    /**
    * 修改标签
    */
    @Path('/:id')
    @PUT
    async modifyLabel( @PathParam('id') id: any, @BodyParam('label') label: any, @CtxParam('ctx') ctx: any) {
        let { userId } = ctx.session.userInfo;
        label['userId'] = userId;
        let result = await Label.findByIdAndUpdate(id, { $set: label }, { new: true });
        return buildResponse(null, result);
    }


    /**
    * 删除标签
    */
    @Path('/:id')
    @DELETE
    async deleteLabel( @PathParam('id') id: any) {
        let result = await Label.findByIdAndRemove(id);
        return buildResponse(null, { _id: id});
    }
}

export default LabelController;