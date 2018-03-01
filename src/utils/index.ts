//生成随机字符串 salt
export function genSalt(len: number = 6): string {
    return genToken(len) + new Date().getTime();
}

//生成随机字符串 token
export function genToken(len: number = 6): string {
    let tokenStrList = '0123456789abcdefghijklmnopqrstuvwxy';
    let tokenStrLen = tokenStrList.length;
    let token = '';
    for (let i = 0; i < len; i++) {
        token += tokenStrList[Math.floor(Math.random() * tokenStrLen)];
    }
    return token;
}

/**
 * error first function
 * 构建响应对象 
 * {success, errorCode, data}
 * @param errorCode 
 * @param data 
 */
export function buildResponse(errorCode: string, data?: any) {
    if (!errorCode) {
        return { success: true, data, errorCode: null };
    }
    return { success: false, data: null, errorCode };
}

/**
 * 校验 email 是否合法
 * @param email 
 */
export function checkEmail(email: string) {
    return /^[\w]+@[\w]{1,5}\.[a-zA-Z]{2,3}$/.test(email);
}