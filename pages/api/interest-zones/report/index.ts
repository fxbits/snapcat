import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { reportService } from '../../../../services/report-service';

export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    switch (req.method) {
        case 'POST':
            try{
                const roles = getSession(req, res)?.user[process.env.AUTH0_ROLES_NAMESPACE!];
                const csvRecords = await reportService.getReportFile(req.body, roles);
                res.status(200).json({records: csvRecords});
            } catch(error: any) {
                res.status(500).json({message: error.message})
            }
            break;
    }
});

