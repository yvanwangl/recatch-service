import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({
    id:Number,
    title:String,
    author:String,
    plaintext:String,
    content:String,
    publishDate:Date,
    blogStatus:String,
    count:Number,
    type:String,
    updateDate:String
});

postSchema.statics.findByStatus = async (postStatus) => await this.find({postStatus: new RegExp(postStatus, 'i')});

export default mongoose.model('Post', postSchema);