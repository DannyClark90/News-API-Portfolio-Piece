const { selectAllEndpoints, selectTopics, selectArticleById } = require("../models/get.models"); //Import models

exports.getAllEndpoints = (req, res, next) => {
   selectAllEndpoints()
   .then((allEndPoints) => {
    res.status(200).send({allValidEndpoints: allEndPoints});
   })
   .catch(next)
};

exports.getTopics = (req, res, next) => {
   selectTopics()
   .then((topics) => {
       res.status(200).send({topics})
   })
   .catch(next)
};

// exports.getArticleById = (req, res, next) => {
//    console.log("IN CONTROLLER!!!!!!");
//    const { article_id } = req.params;
//     selectArticleById( article_id )
//     .then((article) => {
//       res.status(200).send({ article });
//     })
//     .catch(next)
// };