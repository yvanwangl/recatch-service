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
});

postSchema.statics.findByStatus = async (postStatus) => await this.find({ postStatus: new RegExp(postStatus, 'i') });

postSchema.statics.findByUser = async (userId) => await this.find({ userId: new RegExp(userId, 'i') });

export default mongoose.model('Post', postSchema);