import { connect } from 'mongoose';
import { zoneService } from './zone-service';

export interface ReportRecord {
    observations: string,
    gender: string,
    hospitalizationDate: string,
    releaseDate: string,
    volunteerName: string, 
    place: string
}

class ReportService {

    constructor() {
        connect(process.env.MONGODB_URI!).then().catch();
    }

    async getReportFile({startDate, endDate} : {startDate: string, endDate: string}, roles?: string[]): Promise<ReportRecord[]> {
        if (!roles?.includes('admin')) {
            throw Error('Unauthorized operation.');
        }
    
        let records: ReportRecord[] = []; 
        const hospitalizationDate = new Date(startDate);
        const releaseDate = new Date(endDate);
        const interestZones = await zoneService.findAll();

        for (const interestZone of interestZones) {
            const place = interestZone.address.name;

            for (const cat of interestZone.sterilizedCats) {
                if (cat.hospitalizationDate && cat.releaseDate) {
                    const catHospitalizationDate = new Date(cat.hospitalizationDate);
                    const catReleaseDate = new Date(cat.releaseDate);
                     
                    if ((catHospitalizationDate >= hospitalizationDate && catHospitalizationDate <= releaseDate) || 
                    (catReleaseDate >= hospitalizationDate && catReleaseDate <= releaseDate)) {
                        records.push({
                            observations: cat.observations.replace(/,/g, ' ').replace(/(\r\n|\n|\r)/gm, ';'),
                            gender: cat.gender,
                            hospitalizationDate: isNaN(catHospitalizationDate.getTime()) ? '' : `${catHospitalizationDate.getDate()}.${catHospitalizationDate.getMonth() + 1}.${catHospitalizationDate.getFullYear()}`,
                            releaseDate:  isNaN(catReleaseDate.getTime()) ? '' : `${catReleaseDate.getDate()}.${catReleaseDate.getMonth() + 1}.${catReleaseDate.getFullYear()}`,
                            volunteerName: cat.volunteerName, 
                            place: place.replace(/,/g, " ")
                        });
                    }
                }
            }
        }

        return records;
    }
}

export const reportService = new ReportService();
