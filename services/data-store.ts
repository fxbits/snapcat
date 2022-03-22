import ZoneSchema from '../data/zone.schema';
import { convertAddressToLocation } from '../utils/location.utils';
import { dbConnection } from './data.service';

const databaseConnection = dbConnection;

export const exportData = async (rawData: any[]) => {
    // remove column headers
    rawData.splice(0, 1); 

    for(let row of rawData){
        if (!row.length) continue;

        const inDate = row[1];
        const details = row[2];
        const sex = row[3];
        const zoneName = row[4];
        const responsible = row[5];
        const outDate = row[9];
        const observations = row[10] ?? "";
        const media = row[11];

        // do not abuse this line, more expensive than you might expect
        const coordinates = await convertAddressToLocation(`${zoneName}, ${process.env.CITY_LOCATION}`);

        try{
            let zone = await ZoneSchema.findOne({'address.lng': coordinates.lng, 'address.lat': coordinates.lat}).exec();
            
            if (!zone) {
                zone = new ZoneSchema({
                    address: {
                        name: zoneName,
                        lat: coordinates.lat,
                        lng: coordinates.lng,
                    },
                    contactPerson: {
                        name: responsible
                    }
                });
            } 
            zone.sterilizedCats.push({
                sex: sex,
                mediaLinks: media,
                hospitalizationDate: inDate,
                releaseDate: outDate,
                observations: `Importata din Excel: ${observations}-${details}`
            });
            await zone.save();
        } catch (error: any){
            console.log(error);
        }
    }
}   
