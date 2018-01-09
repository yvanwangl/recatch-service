module.exports = {
    apps: [
        {
            name: "recatch-service",
            script: "./build/bin/www.js",
            watch: true,
            env: {
                "PORT": 8082,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8082,
                "NODE_ENV": "production",
                "MONGODB_HOST": '',
                "MONGODB_DATABASE":'',
                "MONGODB_PORT":'',
                "MONGODB_USER":'',
                "MONGODB_PWD":'',
                "SERVER_HOST":'',
                "QINIU_PUBLIC_BUCKET_DOMAIN":'',
                "QINIU_ACCESS_KEY":'',
                "QINIU_SECRET_KEY":'',
                "QINIU_BUCKET":'',
                "EMAIL_HOST":'',
                "EMAIL_PORT":'',
                "EMAIL_USER":'',
                "EMAIL_PASS":'',
                "REGISTOR":''
            }
        }
    ]
};