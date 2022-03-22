import { zoneService } from './zone-service';
import { SheetEntry } from '../models/sheet-entry.model';

export const exportData = async (rawData: any[]) => {
    // remove column headers
    rawData.splice(0, 1); 

    for(let row of rawData){
        if (!row.length) {
            continue;
        }

        const newSheetEntry: SheetEntry = {
            inDate: row[1], 
            details: row[2],
            sex: row[3],
            zoneName: row[4],
            responsible: row[5],
            outDate: row[9],
            observations: row[10] ?? "",
            media: row[11]
        }

        try{
            await zoneService.importZone(newSheetEntry);
        } catch (error: any){
            console.log(error);
        }
    }
}   
