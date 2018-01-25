import { Path, GET, POST, PUT, BodyParam, CtxParam, PathParam } from 'iwinter';
import Project from '../models/Project';
import { userLoginAuth } from '../auth';
import { buildResponse } from '../utils';

@Path('/api/projects')
class ProjectController {

    /**
     * 查询所有项目
     */
    @GET
    @Path('/')
    async getAllProjects() {
        //硬编码过滤掉 registor 的项目
        let projects = await Project.find({ userName: { $ne: 'registor' } });
        return buildResponse(null, projects);
    }


    /**
    * 查询当前登录用户的项目
    * @param ctx 
    */
    @GET
    @Path('/get-by-user', userLoginAuth)
    async getProjectsByUser( @CtxParam('ctx') ctx: any) {
        let { userId } = ctx.session.userInfo;
        let projects = await Project.findByUserId(userId);

        return buildResponse(null, projects);
    }

    /**
     * 新增项目
     */
    @POST
    @Path('/', userLoginAuth)
    async addProject( @CtxParam('ctx') ctx: any, @BodyParam('project') project: any) {
        let { userId, username } = ctx.session.userInfo;
        //设置创建人
        Object.assign(project, {
            userId,
            userName: username
        });
        let newProject = new Project(project);
        let result = await newProject.save();
        return buildResponse(null, result);
    }

    /**
     * 修改项目
     */
    @PUT
    @Path('/:projectId', userLoginAuth)
    async modifyProject( @PathParam('projectId') projectId: any, @BodyParam('project') project: any) {
        let result = await Project.findByIdAndUpdate(projectId, { $set: project }, { new: true });
        return buildResponse(null, result);
    }

    /**
     * 删除项目暂不实现
     */

}

export default ProjectController;