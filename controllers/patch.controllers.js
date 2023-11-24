const { updateArticle } = require("../models/patch.models")
const { checkArticleExists } = require("../models/get.models")

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body

    checkArticleExists(article_id)
    .then((articleExists) => {
    if(articleExists)
    updateArticle(article_id, inc_votes)
    .then((updatedArticle) => {
        res.status(200).send({updatedArticle})
    })
    .catch(next)
    })
    .catch(next)
    // .catch((err) => {console.log(err)})
};