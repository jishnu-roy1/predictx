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
 *       - Matches
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

module.exports = router;