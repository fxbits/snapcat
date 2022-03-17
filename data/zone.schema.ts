import mongoose from 'mongoose';
import { Schema } from 'mongoose';

enum Status {
    todo = 'To Do',
    done = 'Done',
    inprogress = 'In Progress'
}

const zoneSchema = new Schema (
    {
        address: Object,
        noUnsterilizedCats: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: Status,
            default: Status.todo
        },
        contactPerson: Object,
        volunteerID: String, 
        observations: {
            type: String,
            default: ""
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

export default mongoose.model('ZoneSchema', zoneSchema);