import { NextApiRequest, NextApiResponse } from "next";
import { putSchedule, Schedule } from "../../../lib/dao/schedule-dao";
import { connectMongo } from "../../../lib/mongo-helper"

const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_DB) {
    throw new Error('MONGODB_DB is not defined.')
}

interface ScheduleApiRequest extends NextApiRequest {
    body: Schedule
}

const handler = async (req: ScheduleApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            console.log('body = ', req.body)
            const { title, contact, datefrom, timefrom, timeto } = req.body;
            if (!title || !contact || !datefrom || !timefrom || !timeto) {
                res.status(422).json({ message: 'Invalid data' });
                return;
            }

            const client = await connectMongo();
            const result = await putSchedule(client, req.body);
            await client.close();

            if (result.insertedId) {
                res.status(201).json({ message: 'successfully created schedule.', data: { ...req.body, _id: result.insertedId.toString() } });
                return;
            }
            res.status(400).json({ message: 'failed to create schedule.' });
    }
}

export default handler;