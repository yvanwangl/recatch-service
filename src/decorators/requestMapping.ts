export const symbolRequestMappingKey = Symbol.for('router:requestMapping');

export const RequestMapping = (pathMapping: string)=>{
    return (constructor: Function)=> {
        Reflect.defineMetadata(symbolRequestMappingKey, pathMapping, constructor.prototype);
    };
};