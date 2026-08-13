const express = require('express');
const authMiddleware = require('../middlewares/auth.js');
const db = require('../../shared/db.js');

const { User } = db;
const router = express.Router();

/**
 * @swagger
 * /admin/users/{id}/role:
 *   post:
 *     summary: Update user role (admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       403:
 *         description: Forbidden - not an admin
 *       404:
 *         description: User not found
 */
// POST /admin/users/:id/role
router.post('/users/:id/role', authMiddleware, async (req, res, next) => {
  try {
    const requester = req.currentUser || req.user;
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.params;
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /admin/matchs:
 *   post:
 *     summary: Create a new match (admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - teamA
 *               - teamB
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               teamA:
 *                 type: string
 *               teamB:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Match created successfully
 *       403:
 *         description: Forbidden - not an admin
 */
// POST /admin/matchs creates a new match (admin only)
router.post('/matchs', authMiddleware, async (req, res, next) => {
  try {
    const requester = req.currentUser || req.user;
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, imageUrl, teamA, teamB, date, location } = req.body;
    
    const match = await db.Match.create({
      title,
      imageURL: imageUrl,
      teamA,
      teamB,
      date,
      location,
    });

    res.json({ message: 'Match created successfully', data: match });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /admin/matchs/winner:
 *   post:
 *     summary: Declare winner and award points (admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - winner
 *               - id
 *               - win_points
 *             properties:
 *               winner:
 *                 type: string
 *               id:
 *                 type: integer
 *               win_points:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Winner declared and points awarded
 *       403:
 *         description: Forbidden - not an admin
 *       404:
 *         description: Match not found
 *       409:
 *         description: Winner already set
 */
// POST /admin/matchs/winner - declare winner and award points
router.post('/matchs/winner', authMiddleware, async (req, res, next) => {
  try {
    const requester = req.currentUser || req.user;
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { winner, id, win_points } = req.body;
    if (!winner) {
      return res.status(400).json({ error: 'winner is required' });
    }

    const result = await db.sequelize.transaction(async (t) => {
      const match = await db.Match.findByPk(id, { transaction: t });
      if (!match) {
        return { status: 404, body: { error: 'Match not found' } };
      }

      if (match.winner) {
        return { status: 409, body: { error: 'Winner already set' } };
      }

      match.winner = winner;
      await match.save({ transaction: t });

      const votes = await db.Vote.findAll({ where: { matchId: id, team: winner }, transaction: t });
      const userIds = Array.from(new Set(votes.map(v => v.userId)));

      for (const userId of userIds) {
        const user = await db.User.findByPk(userId, { transaction: t });
        if (!user) continue;
        user.points = (user.points || 0) + win_points;
        await user.save({ transaction: t });

        await db.Transaction.create({
          userId: user.id,
          matchId: id,
          amount: win_points,
          type: 'award',
          reason: 'correct vote',
        }, { transaction: t });
      }

      return { status: 200, body: { message: 'Winner declared', awarded: userIds.length } };
    });

    if (result && result.status && result.body) {
      return res.status(result.status).json(result.body);
    }

    res.json({ message: 'Winner declared' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
