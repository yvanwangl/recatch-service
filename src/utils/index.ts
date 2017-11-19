import { fail } from "assert";

//生成随机字符串salt
export function genSalt(len: number=6): string{
    let saltStrList = '0123456789abcdefghijklmnopqrstuvwxy';
    let saltStrLen = saltStrList.length;
    let salt = '';
    for(let i=0; i<len; i++) {
        salt += saltStrList[Math.floor(Math.random()*saltStrLen)];
    }
    salt += new Date().getTime();
    return salt
}

/**
 * error first function
 * 构建响应对象 
 * {success, errorCode, data}
 * @param errorCode 
 * @param data 
 */
export function buildResponse(errorCode: string, data?: any){
    if(!errorCode) {
        return {success: true, data, errorCode: null};
    }
    return {success: false, data: null, errorCode};
}