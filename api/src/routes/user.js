const express = require('express');
const authMiddleware = require('../middlewares/auth.js');
const db = require('../../shared/db.js');

const router = express.Router();

/**
 * @swagger
 * /user/vote:
 *   post:
 *     summary: Cast a vote on a match
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matchId
 *               - team
 *             properties:
 *               matchId:
 *                 type: integer
 *               team:
 *                 type: string
 *     responses:
 *       200:
 *         description: Voting successful
 *       400:
 *         description: matchId and team are required, or user already voted
 *       404:
 *         description: Match not found
 *       401:
 *         description: Unauthorized
 */
// to cast vote, the user must be logged in and have a valid token
// POST /user/vote
router.post('/vote', authMiddleware, async (req, res, next) => {
    try {
        const { matchId, team } = req.body;

        if (!matchId || !team) {
            return res.status(400).json({ error: 'matchId and team are required' });
        }

        const match = await db.Match.findByPk(matchId);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        // check if the user has already voted for this match
        const existingVote = await db.Vote.findOne({
            where: {
                userId: req.user.id,
                matchId: matchId
            }
        });

        if (existingVote) {
            return res.status(400).json({ error: 'You have already voted for this match' });
        }
        // insert in votes table with userId, matchId, and team
        const vote = await db.Vote.create({
            userId: req.user.id,
            matchId: matchId,
            team: team
        });

        res.json({ message: 'Voting successful!' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;