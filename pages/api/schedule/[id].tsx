import { Schedule } from '@mui/icons-material';
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteSchedule, updateSchedule } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'DELETE':
            if (req.query.id) {
                const client = await connectMongo();
                const response = await deleteSchedule(
                    client,
                    req.query.id as string
                );
                if (response.acknowledged && response.deletedCount == 1) {
                    res.status(200).json({ message: 'deleted.' });
                } else {
                    res.status(400).json({ message: 'failed' });
                }
                await client.close();
            }
            break;
        case 'PATCH':
            if (req.query.id && req.body) {
                const client = await connectMongo();
                const response = await updateSchedule(
                    client,
                    req.query.id as string,
                    req.body
                );
                // console.log('response = ', response);
                if (response.acknowledged && response.modifiedCount == 1) {
                    res.status(200).json({ message: 'updated.' });
                } else {
                    res.status(400).json({ message: 'failed' });
                }
                await client.close();
            }
            break;
    }
};

export default handler;
