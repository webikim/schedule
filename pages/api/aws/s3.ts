import { NextApiRequest, NextApiResponse } from "next";
import S3 from 'aws-sdk/clients/s3'

const s3 = new S3({
    region: 'us-east-1',
    signatureVersion: 'v4',
})

const config = {
    api: {
        bodyParser: {
            sizeLimit: '200kb'
        }
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, type } = req.body;
    switch (req.method) {
        case 'POST':
            const fileParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: name,
                Expires: 600,
                // ContentType: type,
                // ACL: 'public-read'
            };

            try {
                const url = await s3.getSignedUrl('putObject', fileParams);
                res.status(200).json({ url });
            } catch (err) {
                console.log(err);
                res.status(400).json({ message: err })
            }
            break;

        default:
            res.status(405).json({ message: 'Method is not allowed.' })
            break;
    }
}

export default handler;