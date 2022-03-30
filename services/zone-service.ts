import zoneSchema from '../data/zone.schema';
import { InterestZone, Status } from '../models/zone.model';
import { SheetEntry } from '../models/sheet-entry.model';
import { convertAddressToLocation } from '../utils/location.utils';
import unsterilizedcatSchema from '../data/unsterilizedcat.schema';
import sterilizedcatSchema from '../data/sterilizedcat.schema';
import { Gender, SterilizedCat, UnsterilizedCat } from '../models/cat.model';

import { connect } from 'mongoose';

class ZoneService {
    constructor() {
        connect(process.env.DATABASE_CONN_STRING!).then().catch();
    }
    
    async findById (id: string | string[]): Promise<InterestZone> {
        const interestZone = await zoneSchema.findById(id).exec();
        
        if (!interestZone) {
            throw new Error(`Zone with id ${id} not found`);
        }
        
        return interestZone;
    } 
    
    async findAll (): Promise<InterestZone[]> {
        return await zoneSchema.find();
    }

    async findByCoordinates (coordinates: any): Promise<any> {
        return await zoneSchema.findOne({'address.lng': coordinates.lng, 'address.lat': coordinates.lat}).exec();
    }

    async importZone(sheetEntry: SheetEntry): Promise<void> {
        const coordinates = await convertAddressToLocation(`${sheetEntry.zoneName}, ${process.env.CITY_LOCATION}`);
    
        let zone = await this.findByCoordinates(coordinates);
        const newCatSchema = new sterilizedcatSchema({
            sex: sheetEntry.gender === 'm' ? Gender.MALE : Gender.FEMALE,
            mediaLinls: [sheetEntry.media],
            observations: sheetEntry.observations,
            hospitalizationDate: sheetEntry.inDate,
            releaseDate: sheetEntry.outDate,
            volunteerID: sheetEntry.responsible
        });
        
        if (!zone) {
            zone = new zoneSchema({
                address: {
                    name: sheetEntry.zoneName,
                    lat: coordinates.lat,
                    lng: coordinates.lng,
                },
                contactPerson: {
                    name: sheetEntry.responsible
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
            const catSchema = new unsterilizedcatSchema(unsterilizedCat);
            newZoneSchema.unsterilizedCats.push(catSchema);
        }

        for(const sterilizedCat of interestZone.sterilizedCats) {
            await this.validateSterilizedCat(sterilizedCat);
            const catSchema = new sterilizedcatSchema(sterilizedCat);
            newZoneSchema.sterilizedCats.push(catSchema);
        }

        return await newZoneSchema.save();        
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

export class ZoneValidationError{
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
    OBSERVATIONS = 'MISSING.OBSERVATIONS'
}

export const zoneService = new ZoneService();
