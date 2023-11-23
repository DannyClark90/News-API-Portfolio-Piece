const { updateArticle } = require("../models/patch.models")

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    updateArticle(article_id, inc_votes)
    .then((updatedArticle) => {
        console.log(updatedArticle);
        res.status(200).send({updatedArticle})
    })
    .catch(next)
};