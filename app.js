const express = require("express"); // Import Express.
const app = express(); // Create an instance of Expess library.
const { getTopics, getAllEndpoints, getArticleById, getArticles } = require("./controllers/get.controllers"); // Import controllers.
const { handle404Errors, handleServerErrors, handleCustomErrors, handlePsqlErrors } = require("./errors"); // Import error handlers.

app.get("/api", getAllEndpoints); // Sends parsed endpoints.JSON

app.get("/api/topics", getTopics); // Topics endpoint (gets all topics).

app.get("/api/articles", getArticles); // Articles endpoint (gets all articles).

app.get("/api/articles/:article_id", getArticleById);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

app.all("*", handle404Errors); // handles any invalid path requests.

module.exports = app; //EXPORT APP!
