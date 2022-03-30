import { Gender } from '../models/cat.model';

import mongoose, {Schema} from 'mongoose';

export const sterilizedCatSchema = new Schema(
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
        },
        hospitalizationDate: {
            type: String,
            default: ''
        },
        releaseDate: {
            type: String,
            default: ''
        }, 
        volunteerName: {
            type: String,
            default: ''
        }
    }, 
    {
        timestamps: true
    }
);

export default mongoose.models.sterilizedCatSchema
 || mongoose.model('sterilizedCatSchema', sterilizedCatSchema);
 