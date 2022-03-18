import { importData } from '../../../services/data-import';

import type { NextApiRequest, NextApiResponse } from 'next';

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

