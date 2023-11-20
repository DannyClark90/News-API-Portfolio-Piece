const { selectTopics } = require("../models/topics.model") //Import model

exports.getTopics = (req, res) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
};