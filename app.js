const express = require("express"); // Import Express.
const app = express(); // Create an instance of Expess library.
const { getTopics, getAllEndpoints} = require("./controllers/get.controllers"); // Import controllers.
const { handle404Errors, handleServerErrors } = require("./errors"); // Import error handlers.

app.get("/api", getAllEndpoints); // Sends parsed endpoints.JSON

app.get("/api/topics", getTopics); // Topics endpoint (gets all topics).

app.use(handleServerErrors)

app.all("*", handle404Errors); // handles any invalid path requests.

module.exports = app; //EXPORT APP!
