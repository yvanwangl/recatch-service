import 'reflect-metadata';
import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as koaBody from 'koa-body';
import controller from './controller';

const app = new Koa();

app.use(cors({
    origin: 'http://localhost:3000',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
}));

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ${ctx.request.path}`);
    let startTime = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - startTime;
    ctx.response.set('X-Response-Time', execTime);
});
app.use(koaBody());

//controller
app.use(controller());

app.listen(4000);
console.log('app started at port 4000...');