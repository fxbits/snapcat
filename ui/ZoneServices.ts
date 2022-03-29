import axios from 'axios';
import { InterestZone } from '../models/zone.model';

class ZoneService {

    private baseURL: string;

    constructor(){
        
        this.baseURL="http://localhost:3000/api/interest-zones"
    }
    // get baseURL(){
    //     console.log(`${location.protocol}://${location.hostname}:${location.port}`);
    //     return location.href + "/api/interest-zones";
    // }

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

    async findAll():Promise<InterestZone[]>{
        try{
            const foundZone = await axios.get(this.baseURL);
            const zones= foundZone.data.map((zone:any)=>{
                return {
                    ...zone,
                    id:zone._id
                }
            });
            return zones as InterestZone[];
        }
        catch(error: any) {
            console.log(error);
            throw new Error(error);
        }
    }
}

export const zoneServiceUi = new ZoneService(); 