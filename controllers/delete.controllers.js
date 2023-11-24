const { removeComment } = require("../models/delete.models");

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    removeComment(comment_id)
    .then((msg) => {
        res.status(204).send({msg})
    })
    .catch(console.log(err))
};