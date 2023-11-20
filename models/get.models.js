const db = require("../db/connection") // Require db connection.
const { readFile } = require("fs/promises")

// Reads contents of endpoints.json and sends on to controller.
exports.selectAllEndpoints = () => {
    return readFile(`${__dirname}/../endpoints.json`)
    .then((allEndPoints) => {return JSON.parse(allEndPoints)})
};

exports.selectTopics = () => {
    return db.query(
        `SELECT * FROM topics;`
    ) // Query db.
    .then(({ rows }) => {return rows}); // Query result reurned on key of rows. 
};

// exports.selectArticleById = () => {
//     console.log("IN MODEL!!!!!!");
// };