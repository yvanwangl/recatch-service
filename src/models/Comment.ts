import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

let commentSchema = new Schema({
    parentId: String,
    postId: String,
    postName: String,
    name: String,
    commentTime: {
        type: Date,
        default: new Date()
    },
    commentContent: String,
    agree: {
        type: Number,
        default: 0
    },
    disagree: {
        type: Number,
        default: 0
    },
});

/**
 *here can add same methods or statics
 */
commentSchema.statics.findByParentId = async function (parentId) {
    return await this.find({ parentId });
};

commentSchema.statics.findByPostId = async function (postId) {
    return await this.find({ postId });
};

export default mongoose.model('Comment', commentSchema);