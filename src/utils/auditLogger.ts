import { getAuditCollection } from './mongodbClient.js';

export interface AuditLog {
  id?: string;
  challengeId: string;
  action: string;
  timestamp: Date;
  details: string;
  performedBy: string;
}

// Local in-memory mock store for fallback operations
const mockAudits: AuditLog[] = [
  {
    challengeId: "cuid-prisma-demo",
    action: "CREATE",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    details: "Created challenge 'React Redux State Manager' using Prisma engine.",
    performedBy: "admin"
  },
  {
    challengeId: "cuid-drizzle-demo",
    action: "UPDATE",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    details: "Updated challengeSource to 'Github' and synchronized state via Drizzle ORM.",
    performedBy: "drizzle_system"
  }
];

/**
 * Log a new database transaction audit entry
 */
export async function logAudit(
  challengeId: string,
  action: string,
  details: string,
  performedBy: string = 'system'
): Promise<void> {
  const auditEntry: AuditLog = {
    challengeId,
    action,
    timestamp: new Date(),
    details,
    performedBy
  };

  const collection = getAuditCollection();
  if (collection) {
    try {
      await collection.insertOne(auditEntry);
      console.log(`[MongoDB NoSQL Log] Captured audit trail for challenge ${challengeId} (${action})`);
    } catch (err) {
      console.error('Failed to write audit trail to MongoDB:', err);
    }
  } else {
    // Add to memory sandbox
    mockAudits.unshift(auditEntry);
    if (mockAudits.length > 50) mockAudits.pop(); // keep last 50
    console.log(`[Sandbox Log] Captured audit trail for challenge ${challengeId} (${action})`);
  }
}

/**
 * Retrieve recent system audit logs
 */
export async function getAudits(): Promise<AuditLog[]> {
  const collection = getAuditCollection();
  if (collection) {
    try {
      const dbAudits = await collection
        .find({})
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray();
      
      return dbAudits.map((doc: any) => ({
        id: doc._id.toString(),
        challengeId: doc.challengeId,
        action: doc.action,
        timestamp: doc.timestamp,
        details: doc.details,
        performedBy: doc.performedBy
      }));
    } catch (err) {
      console.error('Failed to query audits from MongoDB, falling back to sandbox logs:', err);
    }
  }
  return mockAudits;
}
