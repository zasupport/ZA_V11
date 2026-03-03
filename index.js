const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// The V11 Ingest Endpoint
app.post('/api/v11/ingest', (req, res) => {
    const { v11_metadata } = req.body;
    const token = req.headers.authorization;

    if (token !== `Bearer ${process.env.V11_AUTH_TOKEN}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log(`Diagnostic received from Serial: ${v11_metadata.serial_number}`);
    res.status(200).json({ status: 'success', message: 'Data logged to V11' });
});

app.get('/', (req, res) => res.send('ZA V11 Health Check Server Active'));

app.listen(port, () => console.log(`Server running on port ${port}`));
