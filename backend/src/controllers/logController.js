const db = require('../config/db');
const {getWebSocketServer} = require('../config/websocket');

const addLog = (req, res) => {
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
        symptoms,
    } = req.body;

    db.run(
        `INSERT INTO daily_logs (user_id, date, mood_rating, anxiety_level, sleep_hours,
                                 sleep_quality, sleep_disturbances, physical_activity_type,
                                 physical_activity_duration, social_interactions, stress_level, symptoms)
         VALUES (?, date ('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            moodRating,
            anxietyLevel,
            sleepHours,
            sleepQuality,
            JSON.stringify(sleepDisturbances),
            physicalActivityType,
            physicalActivityDuration,
            socialInteractions,
            stressLevel,
            symptoms,
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
            const wss = getWebSocketServer();
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
};

const getLogs = (req, res) => {
    const userId = req.user.sub;
    const {timeRange} = req.query;

    let dateFilter = '';
    if (timeRange === 'week') dateFilter = "AND date >= date('now', '-7 days')";
    if (timeRange === 'month') dateFilter = "AND date >= date('now', '-30 days')";

    db.all(
        `SELECT *
         FROM daily_logs
         WHERE user_id = ? ${dateFilter}
         ORDER BY date DESC`,
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({error: 'Failed to retrieve logs'});
            res.json(rows);
        }
    );
};

module.exports = {addLog, getLogs};
