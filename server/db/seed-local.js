/**
 * Seed the local MongoDB database with purchases data.
 * Run from server directory: npm run seed  or  node db/seed-local.js
 */
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoClient } from 'mongodb';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local if present
const envPath = join(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  const env = readFileSync(envPath, 'utf8');
  for (const line of env.split('\n')) {
    const trimmed = (line || '').trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eq = trimmed.indexOf('=');
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    }
  }
}

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB_NAME || 'creditpulse';

const options = {};
if (process.env.MONGO_USERNAME) {
  options.auth = {
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
  };
  options.authSource = 'admin';
  options.authMechanism = 'SCRAM-SHA-1';
}

async function seed() {
  const client = new MongoClient(uri, options);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('purchases');
    const path = join(__dirname, 'seed-purchases.json');
    const data = JSON.parse(readFileSync(path, 'utf8'));
    await collection.deleteMany({});
    const result = await collection.insertMany(data);
    console.log(`Seeded ${result.insertedCount} purchases into ${dbName}.purchases`);
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
