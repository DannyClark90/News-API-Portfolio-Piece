const request = require("supertest"); //Import Supertest (acts as client to send requests).
const app = require("../app"); //Import app (server).
const db = require("../db/connection"); //Import db.
const seed = require("../db/seeds/seed"); // Import seed.
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index"); //Import test data to pass into seed function.
const { readFile } = require("fs/promises")

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
}); // Before each test run seed to refresh db.

afterAll(() => {
  return db.end();
}); //After each test end connection to db.

describe("/api/topics", () => {
  // Happy path test:
  it("200: Should return an array of all topics with correct properties.", () => {
    return request(app) // send request to app.
      .get("/api/topics") //GET req to endpoint.
      .expect(200)
      .then(({ body }) => {
        const { topics } = body; //deconstruct topics from body.
        expect(topics).toHaveLength(3); //length check
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        }); //Object property check.
      });
  });

  // Sad Path Test
  it("404: Should return 'Path Not Found' error message if incorrect endpoint is requested (eg. typo)", () => {
    return request(app) // send request to app.
      .get("/api/tomics") //GET req to miss spelt endpoint.
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path Not Found");
      });
  });
});

describe("/api",() => {
  // Happy path
  it("200: Should return an object describing all of the available endpoints.", () => {
    return request(app) // send request to app.
      .get("/api") //GET req to endpoint.
      .expect(200)
      .then(({ body }) => {
        const { allValidEndpoints } = body // Deconstruct allValidEndPoints from body.
        // Read & parse endpoints.json
        const fetchAllEndpoints = () => {
           return readFile(`${__dirname}/../endpoints.json`)
          .then((endpoints) => {return JSON.parse(endpoints)})
        }
        fetchAllEndpoints().then((endPoints) => {expect(allValidEndpoints).toMatchObject(endPoints)}) // Compare response with contents of endpoints.json.
        
      })
  });

  // Sad path.
  it("404: Should return 'Path Not Found' error message if incorrect endpoint is requested (eg. typo)", () => {
    return request(app) // send request to app.
      .get("/apn") //GET req to miss spelt endpoint.
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path Not Found");
      });
  });
});
