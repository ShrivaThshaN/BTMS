const pool = require('./pool');

// Query to get all columns except the first two
function getAllInstantTable(callback) {
    // Query to get column names excluding the first two columns
    const queryColumns = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'instant_table' AND ORDINAL_POSITION > 2";
    
    pool.query(queryColumns, (err, columns) => {
        if (err) {
            callback(err, null);
            return;
        }

        // Create the column list for the SELECT query
        const columnList = columns.map(col => col.COLUMN_NAME).join(', ');

        // Query to select all data except the first two columns
        const queryData = `SELECT ${columnList} FROM instant_table`;

        pool.query(queryData, (err, rows) => {
            if (err) {
                callback(err, null);
                return;
            }

            callback(null, rows);
        });
    });
}

module.exports = {
    getAllInstantTable
};
