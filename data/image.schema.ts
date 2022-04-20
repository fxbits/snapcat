import mongoose from 'mongoose';
import {Schema} from 'mongoose';

export const imageSchema = new Schema(
    {
        name: String,
        img: {
            data: Buffer,
            contentType: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.models.imageSchema || mongoose.model('imageSchema', imageSchema);
