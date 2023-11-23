const db = require("../db/connection") // Require db connection.
const { readFile } = require("fs/promises")

// Reads contents of endpoints.json and sends on to controller.
exports.selectAllEndpoints = () => {
    return readFile(`${__dirname}/../endpoints.json`)
    .then((allEndPoints) => {return JSON.parse(allEndPoints)})
};

// Returns all from topics table & sends to controller.
exports.selectTopics = () => {
    return db.query(
        `SELECT * FROM topics;`
    ) // Query db.
    .then(({ rows }) => {return rows}); // Query result reurned on key of rows. 
};

// Returns all articles with a count of the comments, sorts them in descending order by time they were created & sends to controller.
exports.selectArticles = () => {
    return db.query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
        FROM comments
        RIGHT JOIN articles
        ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC;`
    )
    .then(({ rows }) => { return rows }); // Query result reurned on key of rows.
    };

// gets all comments for a specified article & sends to controller.
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

exports.checkArticleExists = (article_id) => {
    return db.query(
        `SELECT * FROM articles WHERE article_id = $1;`, [article_id]
    )
    .then((articles) => {
        if(articles.rowCount === 0){
          return Promise.reject({ status: 404, msg: 'Inexistent Article'})
        }
        return true
    })
};

// Returns all comments for a specified article. If rejected, either there are no comments for the requested article_id or the article does not exist.
exports.selectArticleComments = (article_id) => {
    return db.query(
        `SELECT * FROM comments WHERE article_id = $1;`, [article_id]
    )
    .then(({ rows }) => {
        return rows
    })
};

