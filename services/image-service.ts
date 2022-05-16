import imageSchema from '../data/image.schema';
import { ZoneError, zoneService, ZoneValidationError } from './zone-service';

import { connect } from 'mongoose';
import sharp from 'sharp';

class ImageService {
    constructor() {
        connect(process.env.MONGODB_URI!).then().catch();
    }

    private async findImage(imageID: string) {
        try{
            const image = await imageSchema.findById(imageID).exec();
            if (!image) {
                throw new Error();
            }
            return image;
        } catch(error: any) {
            throw new ZoneValidationError(404, ZoneError.IMAGE_NOT_FOUND);
        }
    }

    private async addImage(file: any) {
        const resizedBuffer = await sharp(file.buffer)
                                        .resize({
                                            fit: sharp.fit.contain,
                                            width: 300,
                                            height: 300,
                                            background: {r: 255, g: 255, b: 255, alpha: 0}
                                        })
                                        .png()
                                        .toBuffer();
        const newImage = new imageSchema({
            name: file.name,
            img: {
                data: resizedBuffer,
                contentType: 'image/png'
            }
        });
        
        const image = await newImage.save();
        return image._id;
    }

    async addImages(zoneID: string | string[], catID: string | string[], files: any[]) {        
        let interestZone = await zoneService.findById(zoneID);

        let cat = zoneService.findCat(interestZone, catID, true);
        if (!cat) { 
            cat = zoneService.findCat(interestZone, catID, false);
            if (!cat) {
                throw new ZoneValidationError(404, ZoneError.CAT_NOT_FOUND);
            }
        }
        
        if (!cat.images) {
            cat.images = [];
        }
        if (cat.images.length + files.length > 3) {
            throw new ZoneValidationError(400, ZoneError.MAXIMUM_IMAGES);
        }

        for (const currentFile of files){
            const imageID = await this.addImage(currentFile);
            cat.images.push(imageID);
        }
   
        await interestZone.save();
        return cat.images;
    }

    async getImages(zoneID: string | string[], catID: string | string[]):Promise<any> {
        let interestZone = await zoneService.findById(zoneID);

        let cat = zoneService.findCat(interestZone, catID, true);
        if (!cat) { 
            cat = zoneService.findCat(interestZone, catID, false);
            if (!cat) {
                throw new ZoneValidationError(404, ZoneError.CAT_NOT_FOUND);
            }
        }

        let imageBuffers = []
        for (const imageID of cat.images) {
            const image = await this.findImage(imageID);
            imageBuffers.push(image.img.data);
        }

        return imageBuffers;
    }

    async deleteImage(imageID: string | string[], zoneID?: string | string[], catID?: string | string[]): Promise<void> {
        if (zoneID && catID) {
            let interestZone = await zoneService.findById(zoneID);
        
            let cat = zoneService.findCat(interestZone, catID, true);
            if (!cat) { 
                cat = zoneService.findCat(interestZone, catID, false);
                if (!cat) {
                    throw new ZoneValidationError(404, ZoneError.CAT_NOT_FOUND);
                }
            }
            cat.images.filter((item: string) => item !== imageID);
            await interestZone.save();
        }

        await imageSchema.deleteOne({ _id: imageID });
    }
}

export const imageService = new ImageService();
