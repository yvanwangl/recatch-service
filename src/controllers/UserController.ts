import { RequestMapping } from '../decorators/requestMapping';
import { httpGet, httpPost } from '../decorators/http-methods';
import { path } from '../decorators/path';

@RequestMapping('/api/users')
class UserController {

    @httpGet
    @path('/')
    getAllUsers(){
        return [{
            id: 1, name:'wangyafei',age:20
        }];
    }

    @httpGet
    @path('/:id')
    getUserById({id}){
        return [{id, name:'lihuan'}]
    }
}

export default UserController;