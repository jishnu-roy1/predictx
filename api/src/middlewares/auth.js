import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const parts = authHeader.split(' ').filter(Boolean);
    let token = '';

    if (parts.length === 2) {
        const [scheme, t] = parts;
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ error: 'Malformed authorization header' });
        }
        token = t;
    } else if (parts.length === 1) {
        token = parts[0];
    } else {
        return res.status(401).json({ error: 'Malformed authorization header' });
    }

    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}