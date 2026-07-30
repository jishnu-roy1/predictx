import express from 'express';
import { Op } from 'sequelize';
import authMiddleware from '../middlewares/auth.js';
import db from '../../shared/db.js';

const router = express.Router();

router.get('/test-auth', authMiddleware, (req, res) => {
    res.json({ message: 'auth ok', user: req.user });
});

// GET /api/get-matchs returns a list of matches (public endpoint)
router.get('/get-matchs/', async (req, res, next) => {
    try {
        const { active } = req.query;
        console.log('Query parameters: jishnu', req.query);
        const minMinutes = Number(req.query.minMinutes ?? 30);

        let whereClause = {};
        if (active === 'true') {
            console.log('Filtering for active matches with minMinutes:', minMinutes);
            whereClause = {
                date: {
                    [Op.gte]: new Date(Date.now() + minMinutes * 60 * 1000),
                },
            };
        } else {
            whereClause = {
                date: {
                    [Op.lte]: new Date(),
                },
            };
        }

        const matches = await db.Match.findAndCountAll({ where: whereClause });
        res.json({ message: 'Matches retrieved successfully', data: matches });
    } catch (err) {
        next(err);
    }
});

export default router;