import axios from 'axios';
import { InterestZone } from '../models/zone.model';

class ZoneService {

    get baseURL(){
        return `${process.env.NEXT_PUBLIC_REST_API_BASE_URL}/api/interest-zones/`;
    }

    async findById (id: string): Promise<InterestZone> {      
        const response = await axios.get(this.baseURL + id);
        return response.data;
    } 

    async findAll():Promise<InterestZone[]>{
        const response = await axios.get(this.baseURL);
        return response.data;
    } 
}

export const zoneServiceUi = new ZoneService(); 