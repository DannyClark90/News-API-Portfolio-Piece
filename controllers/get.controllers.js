const { selectAllEndpoints, selectTopics, selectArticles} = require("../models/get.models"); //Import models

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

exports.getArticles = (req, res, next) => {
   console.log("IN CONTROLLER!!!!");
   // selectArticles()
};