import { Status } from '../models/zone.model';

import mongoose, { Schema }  from 'mongoose';

const zoneSchema = new Schema (
    {
        address: Object,
        status: {
            type: String,
            enum: Status,
            default: Status.TODO
        },
        contactPerson: Object,
        volunteerName: {
            type: String,
            default: ''
        }, 
        observations: {
            type: String,
            default: ''
        },
        unsterilizedCats: {
            type: [Object],
            default: []
        },
        sterilizedCats: {
            type: [Object],
            default: []
        }
    },
    {
        timestamps: true
    },
);

export default mongoose.models.zoneSchema || mongoose.model('zoneSchema', zoneSchema);
