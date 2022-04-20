import { ZoneValidationError } from '../../../../../../services/zone-service';
import { imageService } from '../../../../../../services/image-service';

import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import multer from 'multer';
import nextConnect from 'next-connect';
import BSON from 'bson';

const upload = multer();

const apiRoute = nextConnect({
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
      },
});

apiRoute.use(upload.array('images', 3));

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try{
    const catImages = await imageService.getImages(req.query.id, req.query.catID);
    
    let imageBuffers = []
    for (const image of catImages) {
        imageBuffers.push(BSON.serialize(image));
    }
    
    res.json({imageBuffers: imageBuffers});
  } catch(error: any) {
    if (error instanceof ZoneValidationError) {
        res.status(error.getStatus()).json({message: error.getErrorCode()});
    }
    else {
        res.status(500).json({message: error.message});
    }
  } 
});

apiRoute.post(async (req: any, res: any) => {
    try{
        await imageService.addImages(req.query.id, req.query.catID, req.files);
        
        res.json({files: req.files});
      } catch(error: any) {
        if (error instanceof ZoneValidationError) {
            res.status(error.getStatus()).json({message: error.getErrorCode()});
        }
        else {
            res.status(500).json({message: error.message});
        }
      } 
});

export default withApiAuthRequired(apiRoute);

export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };
