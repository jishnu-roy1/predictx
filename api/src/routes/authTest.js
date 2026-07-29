import express from 'express';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.get('/test-auth', authMiddleware, (req, res) => {
    res.json({ message: 'auth ok', user: req.user });
});

export default router;