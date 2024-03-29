const express = require("express"); // Import Express.
const cors = require('cors'); // Import CORS.
const app = express(); // Create an instance of Expess library.
const { getTopics, getAllEndpoints, getArticleById, getArticles, getArticleComments, getAllUsers} = require("./controllers/get.controllers"); // Import controllers.
const { postArticleComment } = require("./controllers/post.controllers") // Import post controllers.
const { patchArticle } = require("./controllers/patch.controllers") // Import patch controllers.
const { deleteComment } = require("./controllers/delete.controllers") // Import delete controllers.
const { handle404Errors, handleServerErrors, handleCustomErrors, handlePsqlErrors } = require("./errors"); // Import error handlers.

app.use(cors());

app.use(express.json()) // Imports json from express library (parses incoming requests)

app.get("/api", getAllEndpoints); // Sends parsed endpoints.JSON

app.get("/api/topics", getTopics); // Topics endpoint (gets all topics).

app.get("/api/articles", getArticles); // Gets all articles including a total count of all the comments with the comment count of each article.

app.get("/api/articles/:article_id", getArticleById); // Gets an article matching the specified article_id.

app.get("/api/articles/:article_id/comments", getArticleComments) // Returns all comments for a specified article.

app.post("/api/articles/:article_id/comments", postArticleComment) // Posts a comment to article matching the specified  article_id

app.patch("/api/articles/:article_id", patchArticle) // Updates the specified article.
app.delete("/api/comments/:comment_id", deleteComment) // Deletes a specified comment.
app.get("/api/users", getAllUsers)

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

app.all("*", handle404Errors); // Handles any invalid path requests.

module.exports = app; //EXPORT APP!
