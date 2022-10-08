import { MongoClient, ObjectId } from 'mongodb'
import dayjs from 'dayjs';

const MONGODB_DB = process.env.MONGODB_DB;
const RESERVE_COLLECTION = 'reserve';

export type ReserveDtoType = {
    email: string,
    schedule?: string,
    date: Date
}

export type Reserve = {
    sch: string,
    ymd: string,
    hm: string,
    email: string
}

const toYmdHm = (date: string | Date) => {
    const day = dayjs(date);
    return [day.format('YYYY-MM-DD'), day.format('HH:mm')]
}

export const convertReserve2Dto = (reserved: Reserve[]) => {
    return reserved.map((each) => {
        return {
            email: each.email,
            date: new Date(each.ymd + ':' + each.hm),
        };
    });
};

export const putReserve = async (client: MongoClient, reserve: ReserveDtoType) => {
    const db = client.db(MONGODB_DB);
    const col = db.collection(RESERVE_COLLECTION);
    const [ymd, hm] = toYmdHm(reserve.date);
    const record = await col.findOne({ ymd: ymd, hm: hm });
    if (!record) {
        return await col.insertOne({ sch: reserve.schedule, ymd: ymd, hm: hm, email: reserve.email })
    }
    return null;
}

export const getReserve = async (client: MongoClient, schedule: string, date: string) => {
    const db = client.db(MONGODB_DB);
    const col = db.collection(RESERVE_COLLECTION);
    return await col.find({
        $and: [{ sch: { $eq: schedule } },
        { ymd: { $eq: dayjs(date).format('YYYY-MM-DD') } }]
    }, { projection: { _id: 0 } }
    ).toArray();
}

export const getWeekReserve = async (client: MongoClient, schedule: string, date: string) => {
    const db = client.db(MONGODB_DB);
    const col = db.collection(RESERVE_COLLECTION);
    const day = dayjs(date);
    const from_ymd = day.format('YYYY-MM-DD');
    const to_date = day.toDate();
    to_date.setDate(to_date.getDate() + 6);
    const to_ymd = dayjs(to_date).format('YYYY-MM-DD');
    return await col.find({
        $and: [{ sch: { $eq: schedule } },
        { ymd: { $gte: from_ymd } },
        { ymd: { $lte: to_ymd } }]
    }, { projection: { _id: 0 } }
    ).toArray();
}
