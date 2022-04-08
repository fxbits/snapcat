import { importData } from '../../../services/data-import';
import { exportData } from '../../../services/data-store';

import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case 'GET':
      try {
        const importedData = await importData(req.body.sheetName);
        res.send(importedData);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;
    // endpoint to add in db from googlesheet
    case 'POST':
      try {
        const importedData = await importData(req.body.sheetName);
        exportData(importedData);
        res.send(importedData);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;
  }
});
