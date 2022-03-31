import { InterestZone } from '../models/zone.model';

import axios from 'axios';

class ZoneService {

    private readonly URL = '/api/interest-zones/';

    async findById (id: string): Promise<InterestZone> {      
        const response = await axios.get(this.URL + id);
        return response.data;
    } 

    async findAll(): Promise<InterestZone[]>{
        const response = await axios.get(this.URL);
        return response.data;
    } 

    async addZone(zone: InterestZone): Promise<InterestZone> {
        const response = await axios.post(this.URL, 
            {
                "address": {
                    "name": zone.address.name,
                    "lat": zone.address.lat,
                    "lng": zone.address.lng
                },
                "noUnsterilizedCats": zone.noUnsterilizedCats,
                "status": zone.status,
                "contactPerson": {
                    "phone": zone.contactPerson?.phone,
                    "name": zone.contactPerson?.name
                },
                "volunteerName": zone.volunteerName,
                "observations": zone.observations,
                "unsterilizedCats": [],
                "sterilizedCats": []
            }
        );
        return response.data;
    }
}

export const zoneServiceUi = new ZoneService(); 