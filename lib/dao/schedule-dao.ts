import { MongoClient, ObjectId } from 'mongodb'

const MONGODB_DB = process.env.MONGODB_DB;
const SCHEDULE_COLLECTION = 'schedule';

export type Schedule = {
    id: string | null;
    title: string;
    desc: string;
    contact: string;
    datefrom: Date;
    dateto: Date | null;
    timefrom: Date;
    timeto: Date;
    created: Date;
    slots: string;
    offday: Date[];
    createdby: string;
}

export const putSchedule = async (client: MongoClient, schedule: Schedule) => {
    const db = client.db(MONGODB_DB);
    schedule.created = new Date();
    return await db.collection(SCHEDULE_COLLECTION).insertOne(schedule);
}

export const getScheduleList = async (client: MongoClient, email: string) => {
    const db = client.db(MONGODB_DB);
    const col = db.collection<Schedule>(SCHEDULE_COLLECTION);

    const query = { createdby: email }
    const rawlist = await col.find(query)
        .toArray();
    // console.log('rawlist = ', rawlist);
    return rawlist.map((each) => {
        return {
            id: each._id.toString(),
            title: each.title,
            desc: each.desc,
            created: each.created.toISOString(),
        };
    });
}

export const getSchedule = async (client: MongoClient, id: string) => {
    const db = client.db(MONGODB_DB);
    const col = db.collection<Schedule>(SCHEDULE_COLLECTION);

    const rawschedule = await col.findOne({ _id: new ObjectId(id) });
    if (rawschedule) {
        return {
            id: id,
            title: rawschedule.title,
            desc: rawschedule.desc,
            contact: rawschedule.contact,
            datefrom: rawschedule.datefrom,
            dateto: rawschedule.dateto || null,
            timefrom: rawschedule.timefrom,
            timeto: rawschedule.timeto,
            created: rawschedule.created.toISOString(),
            slots: rawschedule.slots,
            offday: rawschedule.offday || null,
            createdby: rawschedule.createdby
        }
    }
    return null;
}

export const updateSchedule = async (client: MongoClient, id: string, schedule: Schedule) => {
    const db = client.db(MONGODB_DB);
    const col = db.collection<Schedule>(SCHEDULE_COLLECTION);
    return await col.updateOne({ _id: new ObjectId(id) }, {
        $set: {
            title: schedule.title,
            desc: schedule.desc,
            contact: schedule.contact,
            datefrom: schedule.datefrom,
            dateto: schedule.dateto,
            timefrom: schedule.timefrom,
            timeto: schedule.timeto,
            slots: schedule.slots,
            offday: schedule.offday
        }
    }, { upsert: false })
}

export const deleteSchedule = async (client: MongoClient, id: string) => {
    const db = client.db(MONGODB_DB);
    const col = db.collection<Schedule>(SCHEDULE_COLLECTION);
    return await col.deleteOne({ _id: new ObjectId(id) });
}