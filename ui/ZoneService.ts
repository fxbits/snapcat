import axios from 'axios';
import { InterestZone } from '../models/zone.model';

class ZoneService {

    async findById (id: string): Promise<InterestZone> {
        try {
            const foundZone = await axios.get(id);
            console.log('zone', foundZone.data);
            const oneZone: InterestZone = {
              ...foundZone.data,
              id: foundZone.data._id
            }
            return oneZone as InterestZone;
          }
          catch(error: any) {
            console.log(error);
            throw new Error(error);
          }
    } 
}

export const zoneServiceUi = new ZoneService(); 