import {RequestMapping} from '../decorators/requestMapping';
import {httpGet, httpPost} from '../decorators/http-methods';
import {path} from '../decorators/path';

@RequestMapping('/api/posts')
class PostController {

    @httpGet
    @path('/')
    getAllPosts(){
        return [{
            id: 0, content: 'test', author: 'wangyafei'
        }];
    }
}

export default PostController;