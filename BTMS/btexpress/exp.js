const express = require('express');
const app = express();
const db = require('./app');
const db2 = require('./app2'); // Import the new database module
const cors = require('cors'); // Import CORS middleware

app.use(cors());

// Route for the first database
app.get('/signal_info', (req, res) => {
    db.getAllSignalInfo((err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch data' });
            return;
        }

        // Log data to console
        console.log('Data received from signal_info:');
        console.log(data);

        // Send data as JSON response
        res.json(data);
    });
});

// Route for the second database
app.get('/instant_info', (req, res) => {
    db2.getAllInstantTable((err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch data' });
            return;
        }

        // Log data to console
        console.log('Data received from instant_table:');
        console.log(data);

        // Send data as JSON response
        res.json(data);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
