import { Status } from '../models/zone.model';
import { unsterilizedCatSchema } from './unsterilizedcat.schema';
import { sterilizedCatSchema } from './sterilizedcat.schema';

import mongoose, { Schema } from 'mongoose';

const zoneSchema = new Schema(
  {
    address: {
      type: Object,
      required: true,
    },
    noUnsterilizedCats: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Status,
      default: Status.TODO,
      required: true,
    },
    contactPerson: {
      type: Object,
    },
    volunteerName: {
      type: String,
      default: '',
    },
    observations: {
      type: String,
      default: '',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    unsterilizedCats: [unsterilizedCatSchema],
    sterilizedCats: [sterilizedCatSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.zoneSchema || mongoose.model('zoneSchema', zoneSchema);
