import { MongoClient, Db } from "mongodb";

type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient> | null;
};

const globalWithMongo = globalThis as GlobalWithMongo;

let clientPromise: Promise<MongoClient> | null = globalWithMongo._mongoClientPromise ?? null;

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Falta variable de entorno MONGODB_URI");
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();

    if (process.env.NODE_ENV !== "production") {
      globalWithMongo._mongoClientPromise = clientPromise;
    }
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const dbName = process.env.MONGODB_DB;
  if (!dbName) {
    throw new Error("Falta variable de entorno MONGODB_DB");
  }

  const client = await getClientPromise();
  return client.db(dbName);
}

