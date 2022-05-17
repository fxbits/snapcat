
import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { ZoneValidationError } from '../../../../../services/zone-service';
import { imageService } from '../../../../../services/image-service';

//TODO: add withAPiAuthRequired to secure endpoints
export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'DELETE':
            try {
                await imageService.deleteImage(req.query.imageID, req.query.id, req.query.catID);
                res.status(200).send({message: 'Succesfully deleted.'});
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
