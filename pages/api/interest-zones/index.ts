import { ZoneValidationError, zoneService } from '../../../services/zone-service';

import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired} from '@auth0/nextjs-auth0';

//TODO: add withAPiAuthRequired to secure endpoints
export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    switch (req.method) {
        case 'GET':
            try{
                const interestZoneList = await zoneService.findAll();
                res.json(interestZoneList);
            } catch(error: any) {
                res.status(500).json({message: error.message})
            }
            break;
        case 'POST':
            try{
                const newInterestZone = await zoneService.addZone(req.body);
                res.json(newInterestZone);
            } catch(error: any) {
                if (error instanceof ZoneValidationError) {
                    res.status(error.getStatus()).json({message: error.getErrorCode()});
                }
                else {
                    res.status(500).json({message: error.message});
                }
            }
            break;
    }
});

