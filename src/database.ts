import * as mongoose from 'mongoose';

export default function connectMongoose(){
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/recatch', {
        useMongoClient: true
    });
}