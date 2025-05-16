const pool = require('./pool'); 

function getAllSignalInfo(callback) {
    pool.query('SELECT * FROM signal_info', (err, rows) => {
        if (err) {
            callback(err, null);
            return;
        }

        // Assuming you want to send all rows as JSON array
        callback(null, rows);
    });
}

module.exports = {
    getAllSignalInfo
};
