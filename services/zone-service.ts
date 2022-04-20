import zoneSchema from '../data/zone.schema';
import { InterestZone, Status } from '../models/zone.model';
import { SheetEntry } from '../models/sheet-entry.model';
import { convertAddressToLocation } from '../utils/location.utils';
import unsterilizedCatSchema from '../data/unsterilizedcat.schema';
import sterilizedCatSchema from '../data/sterilizedcat.schema';
import { Gender, SterilizedCat, UnsterilizedCat } from '../models/cat.model';

import { connect } from 'mongoose';
import { release } from 'os';

class ZoneService {
  constructor() {
    connect(process.env.MONGODB_URI!).then().catch();
  }

  async findById(id: string | string[]): Promise<any> {
    try {
      const interestZone = await zoneSchema.findById(id).exec();
      if (!interestZone) {
        throw new Error();
      }
      return interestZone;
    } catch (error: any) {
      throw new ZoneValidationError(404, ZoneError.ZONE_NOT_FOUND);
    }
  }

  async findAll(): Promise<InterestZone[]> {
    //TODO: change query from not equal to true to false
    return await zoneSchema.find({ deleted: { $ne: true } });
  }

  async findByCoordinates(coordinates: any): Promise<any> {
    return await zoneSchema
      .findOne({ 'address.lng': coordinates.lng, 'address.lat': coordinates.lat })
      .exec();
  }

  async importZone(sheetEntry: SheetEntry): Promise<void> {
    const coordinates = await convertAddressToLocation(
      `${sheetEntry.zoneName}, ${process.env.NEXT_PUBLIC_CITY_LOCATION}`
    );

    let zone = await this.findByCoordinates(coordinates);
    const newCatSchema = new sterilizedCatSchema({
      gender: sheetEntry.gender === 'm' ? Gender.MALE : Gender.FEMALE,
      mediaLinks: sheetEntry.media ? [sheetEntry.media] : [],
      observations: `Importata din excel\n${sheetEntry.details}\n${sheetEntry.observations}`,
      hospitalizationDate: sheetEntry.inDate,
      releaseDate: sheetEntry.outDate,
      volunteerName: sheetEntry.responsible,
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
          phone: '',
        },
        unsterilizedCats: [],
        sterilizedCats: [],
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
      sterilizedCats: [],
    });

    if (interestZone.unsterilizedCats) {
      for (const unsterilizedCat of interestZone.unsterilizedCats) {
        await this.validateUnsterilizedCat(unsterilizedCat);
        const catSchema = new unsterilizedCatSchema(unsterilizedCat);
        newZoneSchema.unsterilizedCats.push(catSchema);
      }
    }

    if (interestZone.sterilizedCats) {
      for (const sterilizedCat of interestZone.sterilizedCats) {
        await this.validateSterilizedCat(sterilizedCat);
        const catSchema = new sterilizedCatSchema(sterilizedCat);
        newZoneSchema.sterilizedCats.push(catSchema);
      }
    }

    return await newZoneSchema.save();
  }

  async addCatToZone(zoneID: string | string[], cat: any, interestZone?: any) {
    if (interestZone === undefined) {
      interestZone = await this.findById(zoneID);
    }
    const sterilizedStatus: boolean = await this.validateCat(cat);

    if (sterilizedStatus) {
      const catSchema = new sterilizedCatSchema({
        ...cat,
        images: []
      });
      interestZone.sterilizedCats.push(catSchema);
    } else {
      const catSchema = new unsterilizedCatSchema({
        ...cat,
        images: []
      });
      interestZone.noUnsterilizedCats = interestZone.noUnsterilizedCats
        ? interestZone.noUnsterilizedCats + 1
        : 1;
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

    return await zoneSchema.deleteOne({ _id: zoneID });
  }

  async updateZone(zoneID: string | string[], newZone: InterestZone): Promise<InterestZone> {
    let interestZone = await this.findById(zoneID);

    await this.validateZoneEditting(newZone);

    interestZone.address = {
      ...interestZone.address,
      name: newZone.address.name,
    };
    interestZone.status = newZone.status;
    interestZone.volunteerName = newZone.volunteerName;
    interestZone.observations = newZone.observations;
    interestZone.noUnsterilizedCats = newZone.noUnsterilizedCats;
    interestZone.contactPerson = newZone.contactPerson;

    await interestZone.save();
    return interestZone;
  }

  async deleteCat(zoneID: string | string[], catID: string | string[]): Promise<number> {
    const interestZone = await this.findById(zoneID);
    let cat = this.findCat(interestZone, catID, true);
    if (!cat) {
      cat = this.findCat(interestZone, catID, false);
      if (cat) {
        interestZone.noUnsterilizedCats--;
      }
    }

    if (!cat) {
      throw new ZoneValidationError(404, ZoneError.CAT_NOT_FOUND);
    }

    cat.remove();
    interestZone.save();
    return 1;
  }

  async updateCat(zoneID: string | string[], catID: string | string[], newCat: any): Promise<any> {
    const interestZone = await this.findById(zoneID);
    const sterilizedStatus: boolean = await this.validateCat(newCat);

    let cat = this.findCat(interestZone, catID, sterilizedStatus);
    if (!cat) {
      throw new ZoneValidationError(404, ZoneError.CAT_NOT_FOUND);
    }

    cat.gender = newCat.gender;
    cat.mediaLinks = newCat.mediaLinks;
    cat.observations = newCat.observations;

    if (sterilizedStatus) {
      cat.hospitalizationDate = newCat.hospitalizationDate;
      cat.releaseDate = newCat.releaseDate;
      cat.volunteerName = newCat.volunteerName;
    }

    await interestZone.save();
    return cat;
  }

  async sterilizeCat(
    zoneID: string | string[],
    catID: string | string[],
    newCat: SterilizedCat
  ): Promise<SterilizedCat> {
    let interestZone = await this.findById(zoneID);
    const cat = this.findCat(interestZone, catID, false);
    if (!cat) {
      throw new ZoneValidationError(404, ZoneError.CAT_NOT_FOUND);
    }

    await this.addCatToZone(zoneID, { sterilizedStatus: true, ...newCat }, interestZone);

    cat.remove();
    interestZone.noUnsterilizedCats--;
    await interestZone.save();
    return interestZone;
  }

  findCat(interestZone: any, catID: string | string[], sterilizedStatus: boolean): any {
    if (sterilizedStatus) {
      return interestZone.sterilizedCats.id(catID);
    }

    return interestZone.unsterilizedCats.id(catID);
  }

  private async validateCat(cat: any): Promise<boolean> {
    if (cat?.sterilizedStatus !== false && cat?.sterilizedStatus !== true) {
      throw new ZoneValidationError(400, ZoneError.CAT_TYPE);
    }

    if (cat.sterilizedStatus) {
      await this.validateSterilizedCat(cat);
    } else {
      await this.validateUnsterilizedCat(cat);
    }

    return cat.sterilizedStatus;
  }

  private async validateZoneEditting(body: InterestZone): Promise<void> {
    if (!body) throw new ZoneValidationError(400, ZoneError.ZONE);
    if (!(body?.address?.name?.length > 5)) throw new ZoneValidationError(400, ZoneError.ADDRESS);
    if (!Object.values(Status).includes(body?.status))
      throw new ZoneValidationError(400, ZoneError.STATUS);
    if (!body?.volunteerName) throw new ZoneValidationError(400, ZoneError.VOLUNTEER_NAME);
    if (body.status === Status.DONE && body.noUnsterilizedCats > 0)
      throw new ZoneValidationError(400, ZoneError.STATUS);
    if (!body?.contactPerson?.name) throw new ZoneValidationError(400, ZoneError.CONTACT_PERSON);
    if (!/^\+407([0-9]{8})$/.test(body?.contactPerson?.phone))
      throw new ZoneValidationError(400, ZoneError.CONTACT_PERSON);
  }

  private async validateZone(body: InterestZone): Promise<void> {
    if (!body) throw new ZoneValidationError(400, ZoneError.ZONE);
    if (!(body?.address?.lat > 0 && body?.address?.lng > 0))
      throw new ZoneValidationError(400, ZoneError.COORDINATES);
    if (!(body?.noUnsterilizedCats >= 0))
      throw new ZoneValidationError(400, ZoneError.NO_UNSTERILIZED_CATS);
    if (!Object.values(Status).includes(body?.status))
      throw new ZoneValidationError(400, ZoneError.STATUS);
    if (!body?.contactPerson?.name) throw new ZoneValidationError(400, ZoneError.CONTACT_PERSON);
    if (!/^\+407([0-9]{8})$/.test(body?.contactPerson?.phone))
      throw new ZoneValidationError(400, ZoneError.CONTACT_PERSON);
    if (body.status === Status.INPROGRESS && !body?.volunteerName)
      throw new ZoneValidationError(400, ZoneError.VOLUNTEER_NAME);
  }

  private async validateSterilizedCat(cat: SterilizedCat): Promise<void> {
    if (!cat) throw new ZoneValidationError(400, ZoneError.CAT);
    if (new Date(cat?.hospitalizationDate) > new Date())
      throw new ZoneValidationError(400, ZoneError.HOSPITALIZATION_DATE);
    if (new Date(cat?.releaseDate) > new Date())
      throw new ZoneValidationError(400, ZoneError.REALEASE_DATE);
    const releaseDate: Date = new Date(cat.releaseDate);
    const hospitatlizationDate: Date = new Date(cat.hospitalizationDate);
    if (isNaN(hospitatlizationDate.getTime()))
      throw new ZoneValidationError(400, ZoneError.HOSPITALIZATION_DATE);
    if (isNaN(releaseDate.getTime())) throw new ZoneValidationError(400, ZoneError.REALEASE_DATE);
    if (releaseDate < hospitatlizationDate)
      throw new ZoneValidationError(400, ZoneError.REALEASE_DATE);
    if (!Object.values(Gender).includes(cat?.gender))
      throw new ZoneValidationError(400, ZoneError.GENDER);
    if (!cat?.volunteerName) throw new ZoneValidationError(400, ZoneError.VOLUNTEER_NAME);
  }

  private async validateUnsterilizedCat(cat: UnsterilizedCat): Promise<void> {
    if (!cat) throw new ZoneValidationError(400, ZoneError.CAT);
    if (!Object.values(Gender).includes(cat?.gender))
      throw new ZoneValidationError(400, ZoneError.GENDER);
    if (cat?.mediaLinks?.length === 0 && !cat.observations)
      throw new ZoneValidationError(400, ZoneError.OBSERVATIONS);
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
    CAT_TYPE = 'INCORRECT.CAT_TYPE',
    CAT_NOT_FOUND = 'NOT_FOUND.CAT',
    ZONE_NOT_FOUND = 'NOT_FOUND.ZONE',
    MAXIMUM_IMAGES = 'MAXIMUM_NUMBER.IMAGES',
    IMAGE_NOT_FOUND = 'INCORRECT.IMAGE_ID'
}

export const zoneService = new ZoneService();
