import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({
    id: Number,
    userId: String,
    title: String,
    plaintext: String,
    content: String,
    publishDate: Date,
    blogStatus: String,
    count: Number,
    type: String,
    updateDate: String,
    coverImg: String,
    labels: Array,
});

postSchema.statics.findByStatus = async function (postStatus) {
    return await this.find({ postStatus: new RegExp(postStatus, 'i') })
};

postSchema.statics.findByUserId = async function (userId) {
    return await this.find({ userId });
};

export default mongoose.model('Post', postSchema);