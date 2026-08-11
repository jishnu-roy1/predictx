import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import db from '../../shared/db.js';

const router = express.Router();

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

export default router;