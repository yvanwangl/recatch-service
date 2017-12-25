import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    userId: String,
    userName: String,
    name: String,
    link: String,
    description: String
});

projectSchema.statics.findByUserId = async function (userId) {
    return await this.find({ userId });
};

export default mongoose.model('Project', projectSchema);