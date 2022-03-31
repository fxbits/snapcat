import { InterestZone } from '../models/zone.model';

import axios from 'axios';

class ZoneService {

    private readonly URL = '/api/interest-zones/';

    async findById (id: string): Promise<InterestZone> {      
        const response = await axios.get(this.URL + id);
        return response.data;
    } 

    async findAll():Promise<InterestZone[]>{
        const response = await axios.get(this.URL);
        return response.data;
    } 
}

export const zoneServiceUi = new ZoneService(); 