export const userLoginAuth = (ctx, next)=> ctx.session.userInfo;

export const userAdminLoginAuth = (ctx, next) => ctx.session.userInfo.admin;