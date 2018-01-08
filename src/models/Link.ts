import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    name: String,
    link: String,
    email: String,
    description: String,
    status: {
        type: String,
        enum: ['Valid', 'Review', 'Invalid']
    },
    reason: String
});

export default mongoose.model('Link', linkSchema);