const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS diagnostics (
                id SERIAL PRIMARY KEY,
                serial_number TEXT,
                data JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Database table is ready.");
    } catch (err) {
        console.error("Database init failed:", err);
    }
};
initDb();

app.use(express.json());

// NEW: Route to view the last 10 entries
app.get('/api/v11/view', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM diagnostics ORDER BY created_at DESC LIMIT 10');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.post('/api/v11/ingest', async (req, res) => {
    const { v11_metadata } = req.body;
    const token = req.headers.authorization;
    if (token !== `Bearer ${process.env.V11_AUTH_TOKEN}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        await pool.query(
            'INSERT INTO diagnostics (serial_number, data) VALUES ($1, $2)',
            [v11_metadata.serial_number, req.body]
        );
        res.status(200).json({ status: 'success', message: 'Data saved to Database' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/', (req, res) => res.send('ZA V11 Database Server Active'));
app.listen(port, () => console.log(`Server running on port ${port}`));
