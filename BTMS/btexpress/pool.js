const mysql = require('mysql2');

// Create the connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'cdps1234',
    database: 'btms'
});

// Export the pool for shared use across modules
module.exports = pool;
