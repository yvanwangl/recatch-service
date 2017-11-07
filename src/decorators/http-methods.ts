export const symbolHttpMethodsKey = Symbol.for('router:httpMethod');

const [httpGet, httpPost, httpPut, httpDelete] = ['get', 'post', 'put', 'delete'].map(method => {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(symbolHttpMethodsKey, method, target, propertyKey)
    };
});

export {
    httpGet,
    httpPost,
    httpPut,
    httpDelete
};

// export const httpGet = (target: any, propertyKey: string)=>{
//     Reflect.defineMetadata(symbolHttpMethodsKey, 'get', target, propertyKey)
// };

// export const httpPost = (target: any, propertyKey: string)=>{
//     Reflect.defineMetadata(symbolHttpMethodsKey, 'post', target, propertyKey)
// };

// export const httpPut = (target: any, propertyKey: string)=>{
//     Reflect.defineMetadata(symbolHttpMethodsKey, 'put', target, propertyKey)
// };