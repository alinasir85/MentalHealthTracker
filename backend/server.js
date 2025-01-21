const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const {OAuth2Client} = require('google-auth-library');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
const db = new sqlite3.Database('./mental_health.db');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json());

// Database initialization
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users
            (
                id
                TEXT
                PRIMARY
                KEY,
                email
                TEXT
                UNIQUE,
                name
                TEXT
            )`);

    db.run(`CREATE TABLE IF NOT EXISTS daily_logs
    (
        id
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        user_id
        TEXT,
        date
        TEXT,
        mood_rating
        INTEGER,
        anxiety_level
        INTEGER,
        sleep_hours
        INTEGER,
        sleep_quality
        TEXT,
        sleep_disturbances
        TEXT,
        physical_activity_type
        TEXT,
        physical_activity_duration
        INTEGER,
        social_interactions
        INTEGER,
        stress_level
        INTEGER,
        symptoms
        TEXT,
        FOREIGN
        KEY
            (
        user_id
            ) REFERENCES users
            (
                id
            )
        )`);
});

// WebSocket connection handling
wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');

    // Extract token from query parameters
    const url = new URL(req.url, 'ws://localhost');
    const token = url.searchParams.get('token');

    if (token) {
        verifyGoogleToken(token).then(payload => {
            if (payload) {
                ws.userId = payload.sub;
            } else {
                ws.close();
            }
        });
    }

    ws.on('message', (message) => {
        // Broadcast updates to all connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

// Google Authentication
async function verifyGoogleToken(token) {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        return ticket.getPayload();
    } catch (error) {
        console.error('Error verifying Google token:', error);
        return null;
    }
}

// Authentication middleware
async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).json({error: 'No token provided'});
    }

    // Check if token is revoked
    if (revokedTokens.has(token)) {
        return res.status(401).json({error: 'Token has been revoked'});
    }

    const payload = await verifyGoogleToken(token);
    if (!payload) {
        return res.status(401).json({error: 'Invalid token'});
    }

    req.user = payload;
    next();
}

// Auth endpoints
app.post('/api/auth/google', async (req, res) => {
    const {token} = req.body;
    const payload = await verifyGoogleToken(token);

    if (!payload) {
        return res.status(401).json({error: 'Invalid token'});
    }

    // Store or update user in database
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
                name: payload.name
            });
        }
    );
});

const revokedTokens = new Set();

// Add logout endpoint
app.post('/api/auth/logout', authMiddleware, (req, res) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (token) {
        // Add the token to revoked tokens set
        revokedTokens.add(token);

        // Clean up old tokens periodically
        setTimeout(() => {
            revokedTokens.delete(token);
        }, 24 * 60 * 60 * 1000); // Remove after 24 hours
    }

    // Close any active WebSocket connections for this user
    wss.clients.forEach((client) => {
        if (client.userId === req.user.sub) {
            client.close();
        }
    });

    res.json({success: true});
});

// Daily log endpoints
app.post('/api/log', authMiddleware, (req, res) => {
    const userId = req.user.sub;
    const {
        moodRating,
        anxietyLevel,
        sleepHours,
        sleepQuality,
        sleepDisturbances,
        physicalActivityType,
        physicalActivityDuration,
        socialInteractions,
        stressLevel,
        symptoms
    } = req.body;

    db.run(
        `INSERT INTO daily_logs (user_id, date, mood_rating, anxiety_level, sleep_hours,
                                 sleep_quality, sleep_disturbances, physical_activity_type,
                                 physical_activity_duration, social_interactions, stress_level, symptoms)
         VALUES (?, date ('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            moodRating[0],
            parseInt(anxietyLevel),
            parseInt(sleepHours),
            sleepQuality,
            JSON.stringify(sleepDisturbances),
            physicalActivityType,
            parseInt(physicalActivityDuration),
            parseInt(socialInteractions),
            parseInt(stressLevel),
            symptoms
        ],
        function (err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({error: 'Failed to save log'});
            }

            // Notify connected clients about the new log
            const newLog = {
                id: this.lastID,
                userId,
                ...req.body,
                date: new Date().toISOString()
            };

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'NEW_LOG',
                        data: newLog
                    }));
                }
            });

            res.json({success: true, logId: this.lastID});
        }
    );
});

app.get('/api/logs', authMiddleware, (req, res) => {
    const userId = req.user.sub;
    const {timeRange} = req.query;

    let dateFilter = '';
    switch (timeRange) {
        case 'week':
            dateFilter = "AND date >= date('now', '-7 days')";
            break;
        case 'month':
            dateFilter = "AND date >= date('now', '-30 days')";
            break;
        case '3months':
            dateFilter = "AND date >= date('now', '-90 days')";
            break;
        default:
            dateFilter = '';
    }

    db.all(
        `SELECT *
         FROM daily_logs
         WHERE user_id = ? ${dateFilter}
         ORDER BY date DESC`,
        [userId],
        (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({error: 'Failed to retrieve logs'});
            }

            // Parse JSON strings back to arrays/objects
            const logs = rows.map(row => ({
                ...row,
                sleepDisturbances: this.sleepDisturbances ? JSON.parse(row.sleepDisturbances) : []
            }));

            res.json(logs);
        }
    );
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
