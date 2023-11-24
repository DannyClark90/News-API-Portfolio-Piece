const { selectAllEndpoints, selectTopics, selectArticles, selectArticleById, selectArticleComments, checkArticleExists, selectAllUsers, selectArticlesByTopic, checkTopicExists } = require("../models/get.models"); //Import models

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
   const { topic } = req.query;
   if(topic){
      checkTopicExists(topic)
      .then((topicExists) => {
         if(topicExists){
            selectArticlesByTopic(topic)
            .then((articlesWithTopic) => {
            res.status(200).send({articlesWithTopic})
         })
      }
   })
   .catch(next)
   }
   else{
      selectArticles()
      .then((articles) => {
         res.status(200).send({articles})
      })
      .catch(next)
   }  
   
};

   exports.getArticleById = (req, res, next) => {
   const { article_id } = req.params;
    selectArticleById( article_id )
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next)
};

exports.getArticleComments = (req, res, next) => {
   const { article_id } = req.params

   checkArticleExists(article_id)
   .then((articleExists) => {
      if(articleExists)
         {
            selectArticleComments(article_id)
            .then((article_comments) => {
               res.status(200).send({article_comments})
            })
         }
   })
   .catch(next)
};

exports.getAllUsers = (req, res, next) => {
   selectAllUsers()
   .then((allUsers) => {
      res.status(200).send({allUsers})
   })
   .catch(next)
};