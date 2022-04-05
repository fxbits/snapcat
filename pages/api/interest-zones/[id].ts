import { zoneService, ZoneValidationError } from '../../../services/zone-service';

import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    switch (req.method) {
        case 'GET':
            try{
                const interestZone = await zoneService.findById(req.query.id);
                res.json(interestZone);
            } catch (error: any) {
                res.status(404).json({message: error.message});
            }
        break;
        case 'POST':
            try{
                const newZone = await zoneService.addCatToZone(req.query.id, req.body);
                res.json(newZone);
            } catch (error: any) {
                if (error instanceof ZoneValidationError) {
                    res.status(error.getStatus()).json({message: error.getErrorCode()});
                }
                else {
                    res.status(404).json({message: error.message});
                }
            }
    }
});

