import ZoneSchema from '../data/zone.schema';
import { InterestZone } from '../models/zone.model';
import { SheetEntry } from '../models/sheet-entry.model';
import { convertAddressToLocation } from '../utils/location.utils';

import { connect } from 'mongoose';

class ZoneService {
    constructor() {
        connect(process.env.DATABASE_CONN_STRING!).then().catch();
    }

    async findById (id: string | string[]): Promise<InterestZone> {
        const interestZone = await ZoneSchema.findById(id).exec();
        
        if (!interestZone) {
            throw new Error(`Zone with id ${id} not found`);
        }

        return interestZone;
    } 

    async findAll (): Promise<InterestZone[]> {
        return await ZoneSchema.find();
    }

    async findByCoordinates (coordinates: any): Promise<any> {
        return await ZoneSchema.findOne({'address.lng': coordinates.lng, 'address.lat': coordinates.lat}).exec();
    }

    async importZone(sheetEntry: SheetEntry): Promise<void> {
        const coordinates = await convertAddressToLocation(`${sheetEntry.zoneName}, ${process.env.CITY_LOCATION}`);
    
        let zone = await this.findByCoordinates(coordinates);
            
        if (!zone) {
            zone = new ZoneSchema({
                address: {
                    name: sheetEntry.zoneName,
                    lat: coordinates.lat,
                    lng: coordinates.lng,
                },
                contactPerson: {
                    name: sheetEntry.responsible
                }
            });
        } 
        zone.sterilizedCats.push({
            sex: sheetEntry.sex,
            mediaLinks: sheetEntry.media,
            hospitalizationDate: sheetEntry.inDate,
            releaseDate: sheetEntry.outDate,
            observations: `Importata din Excel: ${sheetEntry.observations}-${sheetEntry.details}`
        });
        await zone.save();
    }
}

export const zoneService = new ZoneService();