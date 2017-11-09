export const symbolPathKey = Symbol.for('router:path');
export const symbolMethodsKey = Symbol.for('router:methods');

export let path = (path: string): Function => {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>)=> {
        //获取原型上的methods属性值
        let methods = Reflect.getMetadata(symbolMethodsKey, target) || [];
        methods.push(propertyKey);
        Reflect.defineMetadata(symbolMethodsKey, methods, target);
        Reflect.defineMetadata(symbolPathKey, path, target, propertyKey);
        if(!descriptor.value) return;
        let oldMethod = descriptor.value;
        descriptor.value = async (ctx, next)=> {
            const params = Object.assign({}, ctx.request.body, ctx.params);
            let result = await oldMethod.call(this, params);
            ctx.response.body = result;
        };
    };
}
