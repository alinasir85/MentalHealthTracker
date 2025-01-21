const verifyGoogleToken = require('../utils/googleAuth');

async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).json({error: 'No token provided'});
    }

    const payload = await verifyGoogleToken(token);
    if (!payload) {
        return res.status(401).json({error: 'Invalid token'});
    }

    req.user = payload;
    next();
}

module.exports = authMiddleware;
