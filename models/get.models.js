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

exports.selectArticles = () => {
    console.log("IN MODEL!!!!");
    return db.query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)
        FROM comments
        JOIN articles
        ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC;`
    )
    .then(({ rows }) => { return rows }); // Query result reurned on key of rows. 
};