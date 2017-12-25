import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    name: String,
    link: String,
    description: String,
    status: {
        type: String,
        enum: ['Valid', 'Review', 'Invaild']
    }
});

export default mongoose.model('Link', linkSchema);