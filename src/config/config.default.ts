export default {
    mongodb: {
        host: 'localhost',
        port: '27017',
        database: 'recatch',
        user: '',
        pwd: ''
    },
    redis: {
        host: 'localhost',
        port: 6379,
        family: 4,
        password: 'auth',
        db: 0
    },
    server: {
        host: 'localhost',
        port: '8082'
    },
    qiniu: {
        //是否上传到七牛
        doUpload: false,
        publicBucketDomain: '',
        accessKey: '',
        secretKey: '',
        bucket: ''
    },
    emial: {
        host: '',
        port: '',
        user: '',
        pass: ''
    },
    page: {
        limit: 30
    },
    //是否开启注册功能
    registor: true
};