import { MongoClient, ObjectId } from 'mongodb'
import dayjs from 'dayjs';

const MONGODB_DB = process.env.MONGODB_DB;
const RESERVE_COLLECTION = 'reserve';

export type Reserve = {
    sch: string,    // schedule id
    em: string,     // email
    df: Date,       // fromdate
    dt: Date,       // todate
    nt?: string      // note
}

export const putReserve = async (client: MongoClient, reserve: Reserve) => {
    const db = client.db(MONGODB_DB);
    const col = db.collection(RESERVE_COLLECTION);
    reserve.df = typeof reserve.df === 'string' ? new Date(reserve.df) : reserve.df;
    reserve.dt = typeof reserve.dt === 'string' ? new Date(reserve.dt) : reserve.dt;
    const record = await col.findOne({ $and: [{ sch: reserve.sch }, { df: reserve.df }] });
    if (!record) {
        return await col.insertOne(reserve);
    }
    return null;
}

export const getReserve = async (client: MongoClient, id: string, datefrom: Date, dateto: Date) => {
    const db = client.db(MONGODB_DB);
    const col = db.collection(RESERVE_COLLECTION);
    const rawlist = await col.find({
        $and: [{ sch: { $eq: id } },
        { df: { $gte: datefrom } },
        { dt: { $lt: dateto } }]
    }, { projection: { _id: 0 } }
    ).toArray();
    return rawlist.map((each) => {
        return {
            sch: each.sch,
            em: each.em,
            df: each.df.toISOString(),
            dt: each.dt.toISOString(),
            nt: each.nt || null
        }
    })
}

export const getWeekReserve = (client: MongoClient, id: string, datefrom: Date) => {
    const dateto = new Date(datefrom);
    dateto.setDate(dateto.getDate() + 7);
    return getReserve(client, id, datefrom, dateto);
}

export const getDayReserve = (client: MongoClient, id: string, date: Date) => {
    const dateto = new Date(date);
    dateto.setDate(dateto.getDate() + 1);
    return getReserve(client, id, date, dateto);
}