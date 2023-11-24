const { removeComment, checkCommentExists  } = require("../models/delete.models");

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    checkCommentExists(comment_id)
    .then((commentExists) => {
        if(commentExists)
        {
            removeComment(comment_id)
            .then(() => {
            res.status(204).send()
            })
        }
    })
    .catch(next)
};