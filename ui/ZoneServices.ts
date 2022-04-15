import { Cat } from './../models/cat.model';
import { InterestZone } from '../models/zone.model';

import axios from 'axios';

const URL = '/api/interest-zones/';

class ZoneService {
  private readonly URL = '/api/interest-zones/';

  async findById(id: string): Promise<InterestZone> {
    const response = await axios.get(this.URL + id);
    return response.data;
  }

  async findAll(): Promise<InterestZone[]> {
    const response = await axios.get(this.URL);
    return response.data;
  }

  async addZone(zone: any): Promise<InterestZone> {
    const response = await axios.post(this.URL, {
      address: {
        name: zone?.address,
        lat: 4325, /// zone.lat
        lng: 5432, /// zone.lng
      },
      noUnsterilizedCats: zone.unsterilizedCats,
      status: zone.status,
      contactPerson: {
        phone: zone.phoneNumber.replace(/ /g, ''),
        name: zone.contactName,
      },
      volunteerName: zone.volunteerName,
      observations: '',
      unsterilizedCats: [],
      sterilizedCats: [],
    });
    return response.data;
  }
}

export const addCatToZone = async (zoneId: string, cat: Cat) => {
  const response = await axios.post(URL + zoneId, { ...cat }, { params: { id: zoneId } });
  return response.data;
};

export const zoneServiceUi = new ZoneService();
