import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const userSchema = new Schema(
    {
        username: {type: String, required: true},
        name: {type: String},
        phone: {type: String}
    },
    {
        timestamps: true
    }
);

export default mongoose.model('UserSchema', userSchema);