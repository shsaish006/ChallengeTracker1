const prisma = require('../utils/prismaClient');

/**
 * Create a new challenge
 */
async function createChallenge(req, res, next) {
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

    res.status(201).json({
      success: true,
      message: 'Challenge created successfully',
      data: challenge
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    next(error);
  }
}

/**
 * Get challenges with optional filtering and pagination
 */
async function getChallenges(req, res, next) {
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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {};
    
    if (status) where.status = status;
    if (type) where.type = type;
    if (track) where.track = track;
    if (challengeSource) where.challengeSource = challengeSource;
    
    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) where.startDate.gte = new Date(startDate);
      if (endDate) where.startDate.lte = new Date(endDate);
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Build order by clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [challenges, total] = await Promise.all([
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
      data: challenges,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    next(error);
  }
}

/**
 * Get challenge by ID
 */
async function getChallengeById(req, res, next) {
  try {
    const { id } = req.params;

    const challenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
        message: `Challenge with ID ${id} does not exist`
      });
    }

    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Get challenge by ID error:', error);
    next(error);
  }
}

/**
 * Update challenge (full update)
 */
async function updateChallenge(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.body.updatedBy || 'system',
      updated: new Date()
    };

    // Check if challenge exists
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!existingChallenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
        message: `Challenge with ID ${id} does not exist`
      });
    }

    const challenge = await prisma.challenge.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Challenge updated successfully',
      data: challenge
    });
  } catch (error) {
    console.error('Update challenge error:', error);
    next(error);
  }
}

/**
 * Patch challenge (partial update)
 */
async function patchChallenge(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.body.updatedBy || 'system',
      updated: new Date()
    };

    // Check if challenge exists
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!existingChallenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
        message: `Challenge with ID ${id} does not exist`
      });
    }

    const challenge = await prisma.challenge.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Challenge updated successfully',
      data: challenge
    });
  } catch (error) {
    console.error('Patch challenge error:', error);
    next(error);
  }
}

/**
 * Delete challenge
 */
async function deleteChallenge(req, res, next) {
  try {
    const { id } = req.params;

    // Check if challenge exists
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!existingChallenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
        message: `Challenge with ID ${id} does not exist`
      });
    }

    await prisma.challenge.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Challenge deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Delete challenge error:', error);
    next(error);
  }
}

/**
 * Get challenge types
 */
async function getChallengeTypes(req, res, next) {
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
async function getChallengeTracks(req, res, next) {
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

module.exports = {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  patchChallenge,
  deleteChallenge,
  getChallengeTypes,
  getChallengeTracks
};
