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

describe("/api/articles/:article_id",() => {
  it('200 sends a single article with the correct properties', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({ body }) => {
        const { article } = body
          expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String)
        })
    });
  });

  it("400: responds with an 'Bad Request' error message when given an invalid id", () => {
    return request(app)
    .get('/api/articles/one')
    .expect(400)
    .then( ({ body }) => {
      expect(body.msg).toBe("Bad Request")
    });
  });

  it("404: sends an 'Inexistent Article' error message when given a valid but non-existent id'", () => {
    return request(app)
    .get('/api/articles/6000')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Inexistent Article")
    })
  });
});