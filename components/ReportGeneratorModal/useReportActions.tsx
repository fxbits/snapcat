import axios from 'axios';
import { ReportRecord } from '../../services/report-service';
import { FormValuesReport } from './ReportGeneratorView';

const URL = '/api/interest-zones/report/';

const generateReport = async (hospitalizationDate: Date, releaseDate: Date) => {
    const response = await axios.post(URL,  {
        startDate: hospitalizationDate,
        endDate: releaseDate
    });
   
    return response.data;
};

const useReportActions = () => {
    const GenerateReport = async (values: FormValuesReport): Promise<ReportRecord[]> => {
        const hospitalizationDate = values.admissionDate;
        const releaseDate = values.releaseDate;
        const data = await generateReport(hospitalizationDate, releaseDate);
    
        return data.records;
    };

    return { GenerateReport };
}

export default useReportActions;

