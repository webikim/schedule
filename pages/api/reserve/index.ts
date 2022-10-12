import { NextApiRequest, NextApiResponse } from "next";
import { deleteReserve, putReserve, Reserve } from "../../../lib/dao/reserve-dao";
import { connectMongo } from "../../../lib/mongo-helper";

const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_DB) {
    throw new Error('MONGODB_DB is not defined.')
}

interface TimeApiRequest extends NextApiRequest {
    body: Reserve
}

const handler = async (req: TimeApiRequest, res: NextApiResponse) => {
    let client;
    let result;
    switch (req.method) {
        case 'POST':
            client = await connectMongo();
            result = await putReserve(client, req.body);
            await client.close();
            if (result && result.insertedId) {
                res.status(200).json({ message: 'successfully reserved.' });
                return;
            }
            res.status(400).json({ message: 'failed to reserve.' });
        case 'DELETE':
            client = await connectMongo();
            const { em, sch, df } = req.query;
            result = await deleteReserve(client, em as string, sch as string, new Date(df as string));
            await client.close();
            if (result && result.deletedCount) {
                res.status(200).json({ message: 'successfully deleted.' });
                return;
            }
            res.status(400).json({ message: 'failed to delete.' });
        default:
            res.status(405).json({ message: 'Method is not allowed.' })
            break;
    }
}

export default handler;