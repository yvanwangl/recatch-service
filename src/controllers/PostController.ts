import {RequestMapping} from '../decorators/requestMapping';
import {httpGet, httpPost} from '../decorators/http-methods';
import {path} from '../decorators/path';
import Post from '../models/Post';

@RequestMapping('/api/posts')
class PostController {

    @httpGet
    @path('/')
    getAllPosts(){
        return [{
            id: 0, content: 'test', author: 'wangyafei', comments: []
        }];
    }

    @httpPost
    @path('/add')
    async addPost(post){
        let newPost = new Post(post);
        let result = await newPost.save();
        return result;
    }
}

export default PostController;