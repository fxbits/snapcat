import { importData } from '../../../services/data-import';
import { exportData } from '../../../services/data-store';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    switch (req.method) {
        case 'GET':
            try{
                const importedData = await importData(req.body.sheetName);
                res.send(importedData);
            } catch(error: any) {
                res.status(500).json({message: error.message})
            }
        break;
        case 'POST': // endpoint to add in db from googlesheet
            try{
                const importedData = await importData(req.body.sheetName);
                exportData(importedData);
                res.send(importedData);
            } catch(error: any) {
                res.status(500).json({message: error.message})
            }
        break;
    }
}

