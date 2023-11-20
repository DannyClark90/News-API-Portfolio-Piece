const express = require("express"); // Import Express.
const app = express(); // Create an instance of Expess library.
const { getTopics } = require("./controllers/topics.controller"); // Import topics controller.
const { handleCustomErrors, handle404Errors } = require("./errors"); // Import error handlers.

app.use(express.json()); // import json from express library.

app.get("/api/topics", getTopics); // Topics endpoint (gets all topics).




app.use(handleCustomErrors);
app.all("*", handle404Errors); // handles any invalid path requests.

module.exports = app; //EXPORT APP!
