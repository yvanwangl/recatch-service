import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

let labelSchema = new Schema({
    userId: String,
    name: String,
    bgColor: String,
    fontColor: String,
    enabled: Boolean
});

labelSchema.statics.findByUserId = async function (userId) {
    return await this.find({ userId });
};

labelSchema.statics.findByIds = async function(ids){
    return await this.find({ _id: { $in: ids } })
};

export default mongoose.model('Label', labelSchema);