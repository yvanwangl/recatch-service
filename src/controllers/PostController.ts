// import {RequestMapping} from '../decorators/requestMapping';
// import {httpGet, httpPost} from '../decorators/http-methods';
// import {path} from '../decorators/path';
import {Path, GET, POST, BodyParam} from 'iwinter';
import Post from '../models/Post';

@Path('/api/posts')
class PostController {

    @GET
    @Path('/')
    getAllPosts(){
        return [{
            id: 0, content: 'test', author: 'wangyafei', comments: []
        }];
    }

    @POST
    @Path('/add')
    async addPost(post){
        let newPost = new Post(post);
        let result = await newPost.save();
        return result;
    }
}

export default PostController;