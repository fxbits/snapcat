import { zoneService } from '../../../services/zone-service';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    switch (req.method) {
        case 'GET':
            try{
                const interestZoneList = await zoneService.findAll();
                res.json(interestZoneList);
            } catch(error: any) {
                res.status(500).json({message: error.message})
            }
        break;
    }
}

