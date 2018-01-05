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
} = process.env;

console.log(MONGODB_HOST);
console.log(QINIU_PUBLIC_BUCKET_DOMAIN);

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
    }
};