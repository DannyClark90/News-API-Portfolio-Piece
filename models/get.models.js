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

exports.selectArticleById = (article_id) => {
    return db.query(
        `SELECT * FROM articles WHERE article_id = $1;`, [article_id]
    )
    .then((result) => {
        if(result.rowCount === 0){
          return Promise.reject({ status: 404, msg: 'Inexistent Article'})
        }
        else{return result.rows[0]}
    })
};