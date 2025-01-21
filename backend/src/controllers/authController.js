const db = require('../config/db');
const verifyGoogleToken = require('../utils/googleAuth');

const revokedTokens = new Set();

const googleAuth = async (req, res) => {
    const {token} = req.body;
    const payload = await verifyGoogleToken(token);

    if (!payload) {
        return res.status(401).json({error: 'Invalid token'});
    }

    db.run(
        'INSERT OR REPLACE INTO users (id, email, name) VALUES (?, ?, ?)',
        [payload.sub, payload.email, payload.name],
        (err) => {
            if (err) {
                return res.status(500).json({error: 'Database error'});
            }
            res.json({
                userId: payload.sub,
                email: payload.email,
                name: payload.name,
            });
        }
    );
};

const logout = (req, res) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (token) {
        revokedTokens.add(token);
        setTimeout(() => revokedTokens.delete(token), 24 * 60 * 60 * 1000); // 24 hours
    }
    res.json({success: true});
};

module.exports = {googleAuth, logout};
