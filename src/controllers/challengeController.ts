import { Request, Response, NextFunction } from 'express';
import { eq, or, ilike, and } from 'drizzle-orm';
import crypto from 'crypto';
import prisma from '../utils/prismaClient.js';
import db from '../utils/drizzleClient.js';
import { challenges } from '../drizzle/schema.js';
import { logAudit, getAudits } from '../utils/auditLogger.js';

// =========================================================================
// PRISMA ORM CONTROLLERS (Primary API)
// =========================================================================

/**
 * Create a new challenge (Prisma)
 */
export async function createChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const challengeData = {
      ...req.body,
      createdBy: req.body.createdBy || 'system',
      created: new Date(),
      updated: new Date()
    };

    const challenge = await prisma.challenge.create({
      data: challengeData
    });

    // Emits Audit trail to MongoDB NoSQL
    await logAudit(
      challenge.id,
      'CREATE',
      `Created challenge '${challenge.name}' using Prisma ORM.`,
      challenge.createdBy
    );

    res.status(201).json({
      success: true,
      message: 'Challenge created successfully (Prisma)',
      data: challenge
    });
  } catch (error) {
    console.error('Create challenge error (Prisma):', error);
    next(error);
  }
}

/**
 * Get challenges with filtering and pagination (Prisma)
 */
export async function getChallenges(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      track,
      challengeSource,
      startDate,
      endDate,
      search,
      sortBy = 'created',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Build where clause
    const where: any = {};
    
    if (status) where.status = status;
    if (type) where.type = type;
    if (track) where.track = track;
    if (challengeSource) where.challengeSource = challengeSource;
    
    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) where.startDate.gte = new Date(startDate as string);
      if (endDate) where.startDate.lte = new Date(endDate as string);
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Build order by clause
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const [challengesList, total] = await Promise.all([
      prisma.challenge.findMany({
        where,
        skip,
        take,
        orderBy
      }),
      prisma.challenge.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      success: true,
      data: challengesList,
      pagination: {
        page: parseInt(page as string),
        limit: take,
        total,
        totalPages,
        hasNextPage: parseInt(page as string) < totalPages,
        hasPreviousPage: parseInt(page as string) > 1
      }
    });
  } catch (error) {
    console.error('Get challenges error (Prisma):', error);
    next(error);
  }
}

/**
 * Get challenge by ID (Prisma)
 */
export async function getChallengeById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const challenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!challenge) {
      res.status(404).json({
        success: false,
        error: 'Challenge not found',
        message: `Challenge with ID ${id} does not exist`
      });
      return;
    }

    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Get challenge by ID error (Prisma):', error);
    next(error);
  }
}

/**
 * Update challenge - Full (Prisma)
 */
export async function updateChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.body.updatedBy || 'system',
      updated: new Date()
    };

    const existingChallenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!existingChallenge) {
      res.status(404).json({
        success: false,
        error: 'Challenge not found',
        message: `Challenge with ID ${id} does not exist`
      });
      return;
    }

    const challenge = await prisma.challenge.update({
      where: { id },
      data: updateData
    });

    // Emits Audit trail to MongoDB NoSQL
    await logAudit(
      challenge.id,
      'UPDATE',
      `Updated challenge '${challenge.name}' (Full) using Prisma ORM.`,
      challenge.updatedBy || 'system'
    );

    res.json({
      success: true,
      message: 'Challenge updated successfully (Prisma)',
      data: challenge
    });
  } catch (error) {
    console.error('Update challenge error (Prisma):', error);
    next(error);
  }
}

/**
 * Patch challenge - Partial (Prisma)
 */
export async function patchChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.body.updatedBy || 'system',
      updated: new Date()
    };

    const existingChallenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!existingChallenge) {
      res.status(404).json({
        success: false,
        error: 'Challenge not found',
        message: `Challenge with ID ${id} does not exist`
      });
      return;
    }

    const challenge = await prisma.challenge.update({
      where: { id },
      data: updateData
    });

    // Emits Audit trail to MongoDB NoSQL
    await logAudit(
      challenge.id,
      'UPDATE',
      `Patched challenge '${challenge.name}' (Partial) using Prisma ORM.`,
      challenge.updatedBy || 'system'
    );

    res.json({
      success: true,
      message: 'Challenge updated successfully (Prisma)',
      data: challenge
    });
  } catch (error) {
    console.error('Patch challenge error (Prisma):', error);
    next(error);
  }
}

/**
 * Delete challenge (Prisma)
 */
export async function deleteChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const existingChallenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!existingChallenge) {
      res.status(404).json({
        success: false,
        error: 'Challenge not found',
        message: `Challenge with ID ${id} does not exist`
      });
      return;
    }

    await prisma.challenge.delete({
      where: { id }
    });

    // Emits Audit trail to MongoDB NoSQL
    await logAudit(
      id,
      'DELETE',
      `Deleted challenge with ID ${id} using Prisma ORM.`,
      'admin'
    );

    res.json({
      success: true,
      message: 'Challenge deleted successfully (Prisma)',
      data: { id }
    });
  } catch (error) {
    console.error('Delete challenge error (Prisma):', error);
    next(error);
  }
}

// =========================================================================
// DRIZZLE ORM CONTROLLERS (Side-by-Side Advanced Feature)
// =========================================================================

/**
 * Create a new challenge (Drizzle)
 */
export async function drizzleCreateChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const newId = `cuid-${crypto.randomUUID()}`;
    const now = new Date();
    
    const challengeData = {
      ...req.body,
      id: newId,
      createdBy: req.body.createdBy || 'drizzle_system',
      created: now,
      updated: now,
      createdAt: now,
      updatedAt: now
    };

    const result = await db.insert(challenges).values(challengeData).returning();

    // Emits Audit trail to MongoDB NoSQL
    await logAudit(
      result[0].id,
      'CREATE',
      `Created challenge '${result[0].name}' using Drizzle ORM.`,
      result[0].createdBy
    );

    res.status(201).json({
      success: true,
      message: 'Challenge created successfully (Drizzle)',
      data: result[0]
    });
  } catch (error) {
    console.error('Create challenge error (Drizzle):', error);
    next(error);
  }
}

/**
 * Get challenges (Drizzle)
 */
export async function drizzleGetChallenges(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, type, track, challengeSource, search } = req.query;

    const conditions = [];

    if (status) conditions.push(eq(challenges.status, status as string));
    if (type) conditions.push(eq(challenges.type, type as string));
    if (track) conditions.push(eq(challenges.track, track as string));
    if (challengeSource) conditions.push(eq(challenges.challengeSource, challengeSource as string));

    if (search) {
      conditions.push(
        or(
          ilike(challenges.name, `%${search}%`),
          ilike(challenges.description, `%${search}%`)
        )
      );
    }

    const query = db.select().from(challenges);
    
    let result;
    if (conditions.length > 0) {
      result = await query.where(and(...conditions));
    } else {
      result = await query;
    }

    res.json({
      success: true,
      message: 'Retrieved challenges using Drizzle ORM',
      data: result,
      pagination: {
        total: result.length,
        note: 'Drizzle endpoint serves simple full-listing for demo'
      }
    });
  } catch (error) {
    console.error('Get challenges error (Drizzle):', error);
    next(error);
  }
}

/**
 * Get challenge by ID (Drizzle)
 */
export async function drizzleGetChallengeById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const result = await db.select().from(challenges).where(eq(challenges.id, id));

    if (result.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Challenge not found',
        message: `Challenge with ID ${id} does not exist (Drizzle)`
      });
      return;
    }

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Get challenge by ID error (Drizzle):', error);
    next(error);
  }
}

/**
 * Update challenge (Drizzle)
 */
export async function drizzleUpdateChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.body.updatedBy || 'drizzle_system',
      updated: new Date(),
      updatedAt: new Date()
    };

    const result = await db.update(challenges)
      .set(updateData)
      .where(eq(challenges.id, id))
      .returning();

    if (result.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Challenge not found',
        message: `Challenge with ID ${id} does not exist (Drizzle)`
      });
      return;
    }

    // Emits Audit trail to MongoDB NoSQL
    await logAudit(
      result[0].id,
      'UPDATE',
      `Updated challenge '${result[0].name}' using Drizzle ORM.`,
      result[0].updatedBy || 'drizzle_system'
    );

    res.json({
      success: true,
      message: 'Challenge updated successfully (Drizzle)',
      data: result[0]
    });
  } catch (error) {
    console.error('Update challenge error (Drizzle):', error);
    next(error);
  }
}

/**
 * Delete challenge (Drizzle)
 */
export async function drizzleDeleteChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const result = await db.delete(challenges).where(eq(challenges.id, id)).returning();

    if (result.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Challenge not found',
        message: `Challenge with ID ${id} does not exist (Drizzle)`
      });
      return;
    }

    // Emits Audit trail to MongoDB NoSQL
    await logAudit(
      id,
      'DELETE',
      `Deleted challenge with ID ${id} using Drizzle ORM.`,
      'drizzle_admin'
    );

    res.json({
      success: true,
      message: 'Challenge deleted successfully (Drizzle)',
      data: { id }
    });
  } catch (error) {
    console.error('Delete challenge error (Drizzle):', error);
    next(error);
  }
}

// =========================================================================
// AUDIT LOGS ENDPOINT (MongoDB NoSQL)
// =========================================================================

/**
 * Retrieve MongoDB/Sandbox activity audit trails
 */
export async function getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const audits = await getAudits();
    res.json({
      success: true,
      message: 'Retrieved NoSQL audit trail from MongoDB',
      data: audits
    });
  } catch (error) {
    next(error);
  }
}

// =========================================================================
// SUPPORTING ENDPOINTS
// =========================================================================

/**
 * Get challenge types
 */
export async function getChallengeTypes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const types = await prisma.challengeType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error('Get challenge types error:', error);
    next(error);
  }
}

/**
 * Get challenge tracks
 */
export async function getChallengeTracks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tracks = await prisma.challengeTrack.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: tracks
    });
  } catch (error) {
    console.error('Get challenge tracks error:', error);
    next(error);
  }
}
