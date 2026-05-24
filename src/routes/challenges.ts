import { Router } from 'express';
import * as challengeController from '../controllers/challengeController.js';
import { validateChallenge, validateChallengeUpdate } from '../middleware/validation.js';

const router = Router();

// =========================================================================
// SUPPORTING ENDPOINTS (Must come before /:id routes)
// =========================================================================
router.get('/types', challengeController.getChallengeTypes);
router.get('/tracks', challengeController.getChallengeTracks);

// =========================================================================
// DRIZZLE ORM ENDPOINTS (Side-by-Side Advanced Demo)
// =========================================================================
router.post('/drizzle', validateChallenge, challengeController.drizzleCreateChallenge);
router.get('/drizzle', challengeController.drizzleGetChallenges);
router.get('/drizzle/:id', challengeController.drizzleGetChallengeById);
router.put('/drizzle/:id', validateChallengeUpdate, challengeController.drizzleUpdateChallenge);
router.patch('/drizzle/:id', validateChallengeUpdate, challengeController.drizzleUpdateChallenge);
router.delete('/drizzle/:id', challengeController.drizzleDeleteChallenge);

// =========================================================================
// PRISMA ORM ENDPOINTS (Standard REST CRUD)
// =========================================================================
router.post('/', validateChallenge, challengeController.createChallenge);
router.get('/', challengeController.getChallenges);
router.get('/:id', challengeController.getChallengeById);
router.put('/:id', validateChallengeUpdate, challengeController.updateChallenge);
router.patch('/:id', validateChallengeUpdate, challengeController.patchChallenge);
router.delete('/:id', challengeController.deleteChallenge);

export default router;
