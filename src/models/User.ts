import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    salt: String,
    admin: Boolean,
    status: {
        type: String,
        enum: ['Valid', 'Invaild'],
    }
});

/**
 *here can add same methods or statics
 */
userSchema.statics.findByUsername = async function (username) {
    return await this.find({username});
};

export default mongoose.model('User', userSchema);