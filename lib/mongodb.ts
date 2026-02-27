import { MongoClient, type Db, type Collection } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongoCache {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoCache: MongoCache | undefined;
}

const cached: MongoCache = global.mongoCache ?? { client: null, promise: null };

if (!global.mongoCache) {
  global.mongoCache = cached;
}

async function getClient(): Promise<MongoClient> {
  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = new MongoClient(MONGODB_URI!).connect();
  }

  try {
    cached.client = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db();
}

export async function getCollection<T extends Document>(
  name: string
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

let indexesCreated = false;

export async function ensureIndexes(): Promise<void> {
  if (indexesCreated) return;

  const db = await getDb();

  await Promise.all([
    // Users
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("users").createIndex({ username: 1 }, { unique: true }),

    // Verification codes
    db.collection("verification_codes").createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    ),
    db.collection("verification_codes").createIndex({ userId: 1, code: 1 }),

    // Products
    db.collection("products").createIndex({ sellerId: 1 }),
    db.collection("products").createIndex(
      { title: "text", description: "text" }
    ),

    // Orders
    db.collection("orders").createIndex({ buyerId: 1 }),
  ]);

  indexesCreated = true;
}
