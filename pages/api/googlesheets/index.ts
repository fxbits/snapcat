import { importData } from '../../../services/dataImport';

import googleapis, { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';


const auth = new google.auth.GoogleAuth({
    keyFile: 'keys.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
})


export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    switch (req.method) {
        case 'GET':
            try{
                const importedData = await importData("Test1");
                res.send(importedData);
                // Data[][4] -> locul capturarii / zona de interes
                
            } catch(error: any) {
                res.status(500).json({message: error.message})
            }
        break;
    
    }
}

