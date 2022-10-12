import { NextApiRequest, NextApiResponse } from "next";
import { updateUser } from "../../../lib/dao/user-dao";
import { connectMongo } from "../../../lib/mongo-helper";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'PATCH':
            if (req.query.id && req.body) {
                const client = await connectMongo();
                const response = await updateUser(client, {
                    email: req.query.id as string,
                    password: '',
                    fullname: req.body.fullname,
                    contact: req.body.contact,
                    bio: req.body.bio
                })
                if (response.acknowledged && response.modifiedCount == 1) {
                    res.status(200).json({ message: 'updated.' });
                } else {
                    res.status(400).json({ message: 'failed' });
                }
                await client.close();
                res.status(200)
            }
            break;
        default:
            res.status(405).json({ message: 'Method is not allowed.' });
            break;
    }
}

export default handler;