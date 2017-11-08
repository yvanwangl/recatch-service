import * as fs from 'fs';
import * as Router from 'koa-router';
import {symbolRequestMappingKey} from './decorators/requestMapping';
import {symbolHttpMethodsKey} from './decorators/http-methods';
import {symbolPathKey, symbolMethodsKey} from './decorators/path';
import PostController from './controllers/PostController';

const router = new Router();

// const addMapping = (controllerName)=>{
//     //let controller = new controllerName();
//     let controller = new PostController();
//     let prototype = PostController.prototype;
//     let rootPath = Reflect.getMetadata(symbolRequestMappingKey, prototype);
//     let methods = Reflect.getMetadata(symbolMethodsKey, prototype);
//     methods.map(methodName=> {
//         let method = controller[methodName];
//         let httpMethod = Reflect.getMetadata(symbolHttpMethodsKey, controller, methodName);
//         let path = Reflect.getMetadata(symbolPathKey, controller, methodName);
//         router[httpMethod](`${rootPath}${path}`, method);
//     });
// };

const addMapping = (ControllerName)=>{
    //let controller = eval(`new ${controllerName}()`);
    let controller = new ControllerName();
    let prototype = ControllerName.prototype;
    let rootPath = Reflect.getMetadata(symbolRequestMappingKey, prototype);
    let methods = Reflect.getMetadata(symbolMethodsKey, prototype);
    methods.map(methodName=> {
        let method = controller[methodName];
        let httpMethod = Reflect.getMetadata(symbolHttpMethodsKey, controller, methodName);
        let path = Reflect.getMetadata(symbolPathKey, controller, methodName);
        router[httpMethod](`${rootPath}${path}`, method);
    });
};


const addControllers = (dir)=>{
    fs.readdirSync(`${__dirname}/${dir}`)
        .filter((file)=> file.includes('Controller'))
        .map((file)=> {
            addMapping(require(`${__dirname}/${dir}/${file}`).default);
        })
};


const controller = (dir='controllers')=>{
    addControllers(dir);
    return router.routes();
};

export default controller;