import zoneSchema from '../data/zone.schema';
import { InterestZone, Status } from '../models/zone.model';
import { SheetEntry } from '../models/sheet-entry.model';
import { convertAddressToLocation } from '../utils/location.utils';
import unsterilizedCatSchema from '../data/unsterilizedcat.schema';
import sterilizedCatSchema from '../data/sterilizedcat.schema';
import { Gender, SterilizedCat, UnsterilizedCat } from '../models/cat.model';

import { connect } from 'mongoose';

class ZoneService {
    constructor() {
        connect(process.env.MONGODB_URI!).then().catch();
    }
    
    async findById (id: string | string[]): Promise<any> {
        const interestZone = await zoneSchema.findById(id).exec();
        
        if (!interestZone) {
            throw new Error(`Zone with id ${id} not found`);
        }
        
        return interestZone;
    } 
    
    async findAll (): Promise<InterestZone[]> {
        //TODO: change query from not equal to true to false
        return await zoneSchema.find({deleted: {$ne: true}});
    }

    async findByCoordinates (coordinates: any): Promise<any> {
        return await zoneSchema.findOne({'address.lng': coordinates.lng, 'address.lat': coordinates.lat}).exec();
    }

    async importZone(sheetEntry: SheetEntry): Promise<void> {
        const coordinates = await convertAddressToLocation(`${sheetEntry.zoneName}, ${process.env.CITY_LOCATION}`);
    
        let zone = await this.findByCoordinates(coordinates);
        const newCatSchema = new sterilizedCatSchema({
            gender: sheetEntry.gender === 'm' ? Gender.MALE : Gender.FEMALE,
            mediaLinks: sheetEntry.media ? [sheetEntry.media] : [],
            observations: `Importata din excel\n${sheetEntry.details}\n${sheetEntry.observations}`,
            hospitalizationDate: sheetEntry.inDate,
            releaseDate: sheetEntry.outDate,
            volunteerName: sheetEntry.responsible
        });
        
        if (!zone) {
            zone = new zoneSchema({
                address: {
                    name: sheetEntry.zoneName,
                    lat: coordinates.lat,
                    lng: coordinates.lng,
                },
                contactPerson: {
                    name: '',
                    phone: ''
                },
                unsterilizedCats: [],
                sterilizedCats: []
            });
        } 
        zone.sterilizedCats.push(newCatSchema);
        await zone.save();
    }
    
    async addZone(interestZone: InterestZone): Promise<InterestZone> {
        await this.validateZone(interestZone);
        
        const newZoneSchema = new zoneSchema({
            ...interestZone,
            unsterilizedCats: [],
            sterilizedCats: []
        });
        
        for(const unsterilizedCat of interestZone.unsterilizedCats) {
            await this.validateUnsterilizedCat(unsterilizedCat);
            const catSchema = new unsterilizedCatSchema(unsterilizedCat);
            newZoneSchema.unsterilizedCats.push(catSchema);
        }

        for(const sterilizedCat of interestZone.sterilizedCats) {
            await this.validateSterilizedCat(sterilizedCat);
            const catSchema = new sterilizedCatSchema(sterilizedCat);
            newZoneSchema.sterilizedCats.push(catSchema);
        }

        return await newZoneSchema.save();        
    }

    async addCatToZone(zoneID: string | string[], cat: any) {
        const interestZone = await this.findById(zoneID);
        const sterilizedStatus: boolean = await this.validateCat(cat);

        if (sterilizedStatus) {
            const catSchema = new sterilizedCatSchema(cat);
            interestZone.sterilizedCats.push(catSchema);
        } else {
            const catSchema = new unsterilizedCatSchema(cat);
            interestZone.unsterilizedCats.push(catSchema);
        }

        return await interestZone.save(); 
    }

    async deleteZone(zoneID: string | string[]) {
        let interestZone = await this.findById(zoneID);

        // test if there are already sterilized cats assigned to the zone
        // soft delete if any
        if (interestZone.sterilizedCats.length > 0) {
            interestZone.deleted = true;
            await interestZone.save();
            return 1;
        }

        return await zoneSchema.deleteOne({_id: zoneID});
    }

    private async validateCat(cat: any): Promise<boolean> {
        if (cat?.sterilizedStatus !== false && cat?.sterilizedStatus !== true) throw new ZoneValidationError(400, ZoneError.CAT_TYPE);

        if (cat.sterilizedStatus) {
            await this.validateSterilizedCat(cat);
        } else {
            await this.validateUnsterilizedCat(cat);
        }

        return cat.sterilizedStatus;
    }

    private async validateZone(body: InterestZone): Promise<void> {
        if (!body) throw new ZoneValidationError(400, ZoneError.ZONE);
        if (!(body?.address?.lat > 0 && body?.address?.lng > 0)) throw new ZoneValidationError(400, ZoneError.COORDINATES);
        if (!(body?.address?.name?.length > 5)) throw new ZoneValidationError(400, ZoneError.ADDRESS); 
        if (!(body?.noUnsterilizedCats >= 0)) throw new ZoneValidationError(400, ZoneError.NO_UNSTERILIZED_CATS);
        if (!Object.values(Status).includes(body?.status)) throw new ZoneValidationError(400, ZoneError.STATUS);
        if (!body?.contactPerson?.name) throw new ZoneValidationError(400, ZoneError.CONTACT_PERSON);
        if (!/^\+407([0-9]{8})$/.test(body?.contactPerson?.phone)) throw new ZoneValidationError(400, ZoneError.CONTACT_PERSON);
        if (body.status === Status.INPROGRESS && !body?.volunteerName) throw new ZoneValidationError(400, ZoneError.VOLUNTEER_NAME);
    }

    private async validateSterilizedCat(cat: SterilizedCat): Promise<void> {
        if (!cat) throw new ZoneValidationError(400, ZoneError.CAT);
        if ((new Date(cat?.hospitalizationDate) > (new Date()))) throw new ZoneValidationError(400, ZoneError.HOSPITALIZATION_DATE);
        if ((new Date(cat?.releaseDate) > (new Date()))) throw new ZoneValidationError(400, ZoneError.REALEASE_DATE);
        const releaseDate: Date = new Date(cat.releaseDate);
        const hospitatlizationDate: Date = new Date(cat.hospitalizationDate);
        if (isNaN(hospitatlizationDate.getTime())) throw new ZoneValidationError(400, ZoneError.HOSPITALIZATION_DATE);
        if (isNaN(releaseDate.getTime())) throw new ZoneValidationError(400, ZoneError.REALEASE_DATE);
        if (releaseDate < hospitatlizationDate) throw new ZoneValidationError(400, ZoneError.REALEASE_DATE);
        if (!Object.values(Gender).includes(cat?.gender)) throw new ZoneValidationError(400, ZoneError.GENDER);
        if (!cat?.volunteerName) throw new ZoneValidationError(400, ZoneError.VOLUNTEER_NAME);
    }

    private async validateUnsterilizedCat(cat: UnsterilizedCat): Promise<void> {
        if (!cat) throw new ZoneValidationError(400, ZoneError.CAT);
        if (!Object.values(Gender).includes(cat?.gender)) throw new ZoneValidationError(400, ZoneError.GENDER);
        if (cat?.mediaLinks?.length === 0 && !cat.observations) throw new ZoneValidationError(400, ZoneError.OBSERVATIONS);
        if (!cat.observations) throw new ZoneValidationError(400, ZoneError.OBSERVATIONS);
    }
}

export class ZoneValidationError {
    private status: number;
    private errCode: ZoneError;
    
    constructor(status: number, err: ZoneError) {
        this.status = status;
        this.errCode = err;
        Object.setPrototypeOf(this, ZoneValidationError.prototype);
    }
    
    getStatus(): number {
        return this.status;
    }

    getErrorCode(): ZoneError {
        return this.errCode;
    }
}


export enum ZoneError {
    ZONE = 'MISSING.ZONE',
    COORDINATES = 'MISSING.COORDINATES',
    ADDRESS = 'INCORRECT.ADDRESS',
    NO_UNSTERILIZED_CATS = 'MISSING.NUMBER',
    STATUS = 'INCORRECT.STATUS', 
    CONTACT_PERSON = 'INCORRECT.PERSON',
    VOLUNTEER_NAME = 'MISSING.VOLUNTEERNAME',
    CAT = 'MISSING.CAT', 
    HOSPITALIZATION_DATE = 'INCORRECT.HOSPITALIZATIONDATE',
    REALEASE_DATE = 'INCORRECT.RELEASEDATE',
    GENDER = 'INCORRECT.GENDER',
    CAT_VOLUNTEER = 'MISSING.VOLUNTEER',
    OBSERVATIONS = 'MISSING.OBSERVATIONS',
    CAT_TYPE = 'INCORRECT.CAT_TYPE'
}

export const zoneService = new ZoneService();
