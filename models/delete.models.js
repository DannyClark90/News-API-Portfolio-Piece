const db = require("../db/connection") // Require db connection.

exports.removeComment = (comment_id) => {
    return db.query(
        `DELETE FROM comments
        WHERE comment_id = $1`, [comment_id]
    )
};

exports.checkCommentExists = (comment_id) => {
    return db.query(
        `SELECT * FROM comments WHERE comment_id = $1;`, [comment_id]
    )
    .then((comments) => {
        if(comments.rowCount === 0){
          return Promise.reject({ status: 404, msg: 'Inexistent Comment'})
        }
        return true
    })
};