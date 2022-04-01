import { Gender } from '../models/cat.model';

import mongoose, {Schema} from 'mongoose';

export const unsterilizedCatSchema = new Schema(
    {
        gender: {
            type: String,
            enum: Gender,
            default: Gender.UNKNOWN
        },
        mediaLinks: {
            type: [String],
            default: []
        },
        observations: {
            type: String,
            default: ''
        }
    }, 
    {
        timestamps: true
    }
);

export default mongoose.models.unsterilizedCatSchema 
 || mongoose.model('unsterilizedCatSchema', unsterilizedCatSchema);
 