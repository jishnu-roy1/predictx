import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import db from '../../shared/db.js';

const { User } = db;
const router = express.Router();

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

export default router;
