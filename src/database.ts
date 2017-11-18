import * as mongoose from 'mongoose';
import config from './config';

const { mongodb: { host, port, database, user, pwd } } = config;

const authInfo = user && pwd ? `${user}:${pwd}@` : '';

export default function connectMongoose() {
    mongoose.Promise = global.Promise;
    mongoose.connect(`mongodb://${authInfo}${host}:${port}/${database}`, {
        useMongoClient: true
    });
}