import 'reflect-metadata';
import * as Koa from 'koa'
import * as path from 'path';
import * as cors from '@koa/cors';
import * as Router from 'koa-router';
import * as koaStatic from 'koa-static';
import * as koaBody from 'koa-body';
import * as koaSession from 'koa-session';
//import controller from './controller';
import IWinter from 'iwinter';
import connectMongoose from './database';

const app = new Koa();
//connect to mongodb
connectMongoose();

//cros config
//开发模式设置跨域
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        //origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
        credentials: true,
    }));
}

app.keys = ['recatch secret key'];
//config session
const CONFIG = {
    key: 'recatch:sess',
    maxAge: 86400000
};
app.use(koaSession(CONFIG, app));

//request execute time
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ${ctx.request.path}`);
    let startTime = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - startTime;
    ctx.response.set('X-Response-Time', execTime);
});
app.use(koaBody());

app.use(koaStatic(path.join(__dirname, '../public')));

//controller
app.use(new IWinter({
    engine: 'koa',
    router: new Router(),
    dir: path.join(__dirname, 'controllers')
}).controller());

export default app;