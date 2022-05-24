import { zoneService, ZoneValidationError } from '../../../../services/zone-service';

import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'PUT':
            try{
                const newCat = await zoneService.updateCat(req.query.id, req.query.catID, req.body);
                res.json(newCat);
            } catch (error: any) {
                if (error instanceof ZoneValidationError) {
                    res.status(error.getStatus()).json({message: error.getErrorCode()});
                }
                else {
                    res.status(500).json({message: error.message});
                }
            }
            break;
        case 'PATCH':
            try {
                const newSterilizedCat = await zoneService.sterilizeCat(req.query.id, req.query.catID, req.body);
                res.json(newSterilizedCat);
            } catch (error: any) {
                if (error instanceof ZoneValidationError) {
                    res.status(error.getStatus()).json({message: error.getErrorCode()});
                }
                else {
                    res.status(500).json({message: error.message});
                }
            }
            break;
        case 'DELETE':
            try {
                const deletedCount = await zoneService.deleteCat(req.query.id, req.query.catID);
                res.json({deleted: deletedCount})
            } catch (error: any) {
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
