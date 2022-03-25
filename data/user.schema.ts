import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const userSchema = new Schema(
    {
        email: {type: String, required: true},
        name: {type: String},
        phone: {type: String}
    },
    {
        timestamps: true
    }
);

export default mongoose.models.userSchema || mongoose.model('UserSchema', userSchema);