const express = require('express');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/auth.js');
const db = require('../../shared/db.js');

const router = express.Router();

/**
 * @swagger
 * /api/get-matchs:
 *   get:
 *     summary: Get matches (active or past)
 *     tags:
 *       - Common
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter for active or past matches
 *       - in: query
 *         name: minMinutes
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Minimum minutes in the future for active matches
 *     responses:
 *       200:
 *         description: Matches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     rows:
 *                       type: array
 *                     count:
 *                       type: integer
 */
// GET /api/get-matchs returns a list of matches (public endpoint)
router.get('/get-matchs/', async (req, res, next) => {
    try {
        const { active } = req.query;
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

// GET /api/leaderboard returns the leaderboard
/**
 * @swagger
 * /api/leaderboard:
 *   get:
 *     summary: Get the leaderboard
 *     tags:
 *       - Common
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page for pagination
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                       totalAmount:
 *                         type: integer
 *                       User:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           username:
 *                             type: string
 *                           email:
 *                             type: string
 */

router.get('/leaderboard', async (req, res, next) => {
    try {
        // get the transactions and group by userId, summing the amount
        // then order by the sum of amount descending
        // add the user information to the result
        // paginate the result by page and limit query parameters
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const offset = (page - 1) * limit;

        const leaderboard = await db.Transaction.findAll({
            attributes: [
                [
                    db.sequelize.literal('ROW_NUMBER() OVER (ORDER BY SUM("Transaction"."amount") DESC)'),
                    'rank',
                ],
                'userId',
                [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'totalAmount'],
            ],
            group: ['userId', 'User.id'],
            order: [[db.sequelize.literal('rank'), 'ASC']],
            include: [
                {
                    model: db.User,
                    attributes: ['email']
                },
            ],
            limit,
            offset,
        });

        res.json({ data: leaderboard });
    } catch (err) {
        next(err);
    }
});

module.exports = router;