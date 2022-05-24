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
                if (error instanceof ZoneValidationError) {
                    res.status(error.getStatus()).json({message: error.getErrorCode()});
                } else {
                    res.status(500).json({message: error.message});
                }
            }
            break;
        case 'POST':
            try{
                const newCat = await zoneService.addCatToZone(req.query.id, req.body);
                res.json(newCat);
            } catch (error: any) {
                if (error instanceof ZoneValidationError) {
                    res.status(error.getStatus()).json({message: error.getErrorCode()});
                } else {
                    res.status(500).json({message: error.message});
                }
            }
            break;
        case 'DELETE':
            try{
                const deletedCount = await zoneService.deleteZone(req.query.id);
                res.json({deleted: deletedCount});
            } catch (error: any) {
                if (error instanceof ZoneValidationError) {
                    res.status(error.getStatus()).json({message: error.getErrorCode()});
                } else {
                    res.status(500).json({message: error.message});
                }
            }
            break;  
        case 'PUT':
            try{
                const newInterestZone = await zoneService.updateZone(req.query.id, req.body);
                res.json(newInterestZone);
            } catch (error: any) {
                if (error instanceof ZoneValidationError) {
                    res.status(error.getStatus()).json({message: error.getErrorCode()});
                }
                else {
                    res.status(500).json({message: error.message});
                }
            }
    }
});

