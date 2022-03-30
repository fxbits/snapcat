import axios from 'axios';
import { InterestZone } from '../models/zone.model';

class ZoneService {

    get baseURL(){
        let baseURL = `${location.protocol}//${location.hostname}:${location.port}`;
        return baseURL + "/api/interest-zones";
    }

    async findById (id: string): Promise<InterestZone> {      
        const response = await axios.get(id);
        return response.data;
    } 

    async findAll():Promise<InterestZone[]>{
        const response = await axios.get(this.baseURL);
        return response.data;
    } 
}

export const zoneServiceUi = new ZoneService(); 