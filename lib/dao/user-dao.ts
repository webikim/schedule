import { MongoClient } from 'mongodb';

const MONGODB_DB = process.env.MONGODB_DB;
const USER_COLLECTION = 'user'

export type User = {
    fullname: string,
    email: string,
    password: string,
    contact?: string,
    bio?: string
}

export const getUserByEmail = async (client: MongoClient, email: string) => {
    const db = client.db(MONGODB_DB);
    return await db.collection<User>(USER_COLLECTION).findOne({
        email: email
    })
}

export const putUser = async (client: MongoClient, user: User) => {
    const db = client.db(MONGODB_DB);
    return await db.collection(USER_COLLECTION).insertOne(user);
}

export const updateUser = async (client: MongoClient, user: User) => {
    const db = client.db(MONGODB_DB);
    const col = db.collection<User>(USER_COLLECTION);
    return await col.updateOne({ email: user.email }, {
        $set: {
            fullname: user.fullname,
            contact: user.contact,
            bio: user.bio,
        }
    }, { upsert: false })
}