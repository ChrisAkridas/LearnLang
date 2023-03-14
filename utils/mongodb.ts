import { MongoClient } from "mongodb";

const { DATABASE_URL  } = process.env;

export const connectDB = async (dbName: string, collectionName: string) => {
  const client = await MongoClient.connect(DATABASE_URL as string);

  const db =  client.db(dbName);
  const collection = db.collection(collectionName);

  return {client, db, collection}
};
