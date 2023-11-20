const db = require("../db/connection") // Require db connection.

exports.selectTopics = () => {
    return db.query(
        `SELECT * FROM topics;`
    ) // Query db.
    .then(({ rows }) => {return rows}); // Query result reurned on key of rows. 
};