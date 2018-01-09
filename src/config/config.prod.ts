let {
    MONGODB_HOST,
    MONGODB_DATABASE,
    MONGODB_PORT,
    MONGODB_USER,
    MONGODB_PWD,
    SERVER_HOST,
    QINIU_PUBLIC_BUCKET_DOMAIN,
    QINIU_ACCESS_KEY,
    QINIU_SECRET_KEY,
    QINIU_BUCKET,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    REGISTOR
} = process.env;

export default {
    mongodb: {
        host: MONGODB_HOST,
        database: MONGODB_DATABASE,
        port: MONGODB_PORT,
        user: MONGODB_USER,
        pwd: MONGODB_PWD,
    },
    server: {
        host: SERVER_HOST
    },
    qiniu: {
        publicBucketDomain: QINIU_PUBLIC_BUCKET_DOMAIN,
        accessKey: QINIU_ACCESS_KEY,
        secretKey: QINIU_SECRET_KEY,
        bucket: QINIU_BUCKET
    },
    emial: {
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
    //由于docker配置环境变量为字符串，此处做兼容处理
    registor: String(REGISTOR) == 'true'
};