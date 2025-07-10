const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const { validateChallenge, validateChallengeUpdate } = require('../middleware/validation');

// Additional endpoints for challenge management (must come before /:id routes)
router.get('/types', challengeController.getChallengeTypes);
router.get('/tracks', challengeController.getChallengeTracks);

// Challenge CRUD routes
router.post('/', validateChallenge, challengeController.createChallenge);
router.get('/', challengeController.getChallenges);
router.get('/:id', challengeController.getChallengeById);
router.put('/:id', validateChallengeUpdate, challengeController.updateChallenge);
router.patch('/:id', validateChallengeUpdate, challengeController.patchChallenge);
router.delete('/:id', challengeController.deleteChallenge);

module.exports = router;
