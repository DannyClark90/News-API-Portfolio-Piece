const db = require("../db/connection") // Require db connection.

exports.insertArticleComment = (commentToPost, articleToPostCommentTo) => {
    const { author, body } = commentToPost
    const { article_id } = articleToPostCommentTo;
    return db.query(
        `INSERT INTO comments
        (body, article_id, author)
        VALUES
        ($1, $2, $3) 
        RETURNING *;`, [body, article_id, author]
    )
    .then(({rows}) => {return rows[0]})
};