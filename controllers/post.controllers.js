const { insertArticleComment } = require("../models/post.models")

exports.postArticleComment = (req, res, next) => {
    articleToPostCommentTo = req.params;
    const commentToPost = req.body;
    
    insertArticleComment(commentToPost, articleToPostCommentTo)
    .then((postedComment) => {
        res.status(201).send({postedComment})
    })
    .catch(next)
};