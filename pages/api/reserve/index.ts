import { NextApiRequest, NextApiResponse } from "next";
import { putReserve, Reserve } from "../../../lib/dao/reserve-dao";
import { connectMongo } from "../../../lib/mongo-helper";

const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_DB) {
    throw new Error('MONGODB_DB is not defined.')
}

interface TimeApiRequest extends NextApiRequest {
    body: Reserve
}

const handler = async (req: TimeApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            const client = await connectMongo();
            const result = await putReserve(client, req.body);
            await client.close();
            if (result && result.insertedId) {
                res.status(200).json({ message: 'successfully reserved.' });
                return;
            }
            res.status(400).json({ message: 'failed to reserve.' });

        default:
            break;
    }
}

export default handler;