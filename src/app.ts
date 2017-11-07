import 'reflect-metadata';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import controller from './controller';

const app = new Koa();
const router = new Router();

app.use(async (ctx, next)=>{
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ${ctx.request.path}`);
    let startTime = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime()-startTime;
    ctx.response.set('X-Response-Time', execTime);
});
app.use(koaBody());

//controller
app.use(controller());


app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');