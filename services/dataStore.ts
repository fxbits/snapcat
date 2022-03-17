import ZoneSchema from '../data/zone.schema';
import { convertAddressToLocation } from '../utils/location.utils';
import { dbConnection } from './data.service';

const databaseConnection = dbConnection;

export const exportData = async (rawData: any[]) => {
    rawData.splice(0, 1); // remove column headers

    // call functions here to modify the data
    // e.g. add lat&lng after use of api
    // e.g. optional: parse zones to point to
    // the same area: C.Brancusi, Brancusi => Brancusi

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
        const coordinates = await convertAddressToLocation(zoneName + ', Cluj-Napoca Romania');

        try{
            // search crit can be defined by lat&lng to point to the same areas
            let zone = await ZoneSchema.findOne({"address.lng": coordinates.lng, "address.lat": coordinates.lat}).exec();
            
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
                observations: observations + '-' + details + '-Importata din Excel'
            });
            await zone.save();
        } catch (error: any){
            console.log(error);
        }
    }
}   