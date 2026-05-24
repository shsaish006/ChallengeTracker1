import { MongoClient, Db, Collection } from 'mongodb';

const mongoURI = process.env.MONGODB_URI;
let dbInstance: Db | null = null;
let auditCollection: Collection | null = null;

export async function connectToMongoDB(): Promise<void> {
  if (!mongoURI) {
    console.log('MONGODB_URI not defined. Audit Logs will run in high-performance local memory sandbox.');
    return;
  }

  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    dbInstance = client.db('challenge_tracker');
    auditCollection = dbInstance.collection('audit_logs');
    console.log('Successfully connected to MongoDB NoSQL Database for system audit logging!');
  } catch (error) {
    console.error('Failed to establish connection to MongoDB database:', error);
  }
}

export function getAuditCollection(): Collection | null {
  return auditCollection;
}
