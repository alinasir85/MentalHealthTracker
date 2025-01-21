const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./mental_health.db');

// Initialize database
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS daily_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        date TEXT,
        mood_rating INTEGER,
        anxiety_level INTEGER,
        sleep_hours INTEGER,
        sleep_quality TEXT,
        sleep_disturbances TEXT,
        physical_activity_type TEXT,
        physical_activity_duration INTEGER,
        social_interactions INTEGER,
        stress_level INTEGER,
        symptoms TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
});

module.exports = db;
