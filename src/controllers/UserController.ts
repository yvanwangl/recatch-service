// import { RequestMapping } from '../decorators/requestMapping';
// import { httpGet, httpPost } from '../decorators/http-methods';
// import { path } from '../decorators/path';
import {Path, GET, POST, PathParam} from 'iwinter';

@Path('/api/users')
class UserController {

    @GET
    @Path('/')
    getAllUsers(){
        return [{
            id: 1, name:'wangyafei',age:20
        }];
    }

    @POST
    @Path('/:id')
    getUserById(@PathParam('id') id: string){
        return [{id, name:'lihuan'}]
    }
}

export default UserController;