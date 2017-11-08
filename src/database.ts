import * as mongoose from 'mongoose';

export default function connectMongoose(){
    mongoose.connect('mongodb://localhost:27017/recatch');
}