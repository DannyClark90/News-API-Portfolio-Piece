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
const endPoints = require("../endpoints.json");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
}); // Before each test run seed to refresh db.

afterAll(() => {
  return db.end();
}); //After each test end connection to db.

describe("GET /api",() => {
  // Happy Path
  it("200: Should return an object describing all of the available endpoints.", () => {
    return request(app) // send request to app.
      .get("/api") //GET req to endpoint.
      .expect(200)
      .then(({ body }) => {
        const { allValidEndpoints } = body // Deconstruct allValidEndpoints 
        expect(allValidEndpoints).toEqual(endPoints) // check recieved to match endpoints.json contents.
      })
})

   // Sad Path Test
   it("404: Should return 'Path Not Found' error message if incorrect endpoint is requested (eg. typo)", () => {
    return request(app) // send request to app.
      .get("/ami") //GET req to miss spelt endpoint.
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path Not Found");
      });
  })
});

describe("GET /api/topics", () => {
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

describe("GET /api/articles",() => {
    // Happy path tests:
    it("200: Should return an array of all articles with correct properties.", () => {
      return request(app) // send request to app.
        .get("/api/articles") //GET req to endpoint.
        .expect(200)
        .then(({ body }) => {
          const { articles } = body; //deconstruct articles from body.
          expect(articles).toHaveLength(13); //length check
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String)
            });
          }); //Object property check.
        });
    });

    it("Should sort date in descending order by default", () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body}) => {
        const { articles } = body
          const orderedDates = articles.map((article) => {
              return article.created_at
          })
          expect(orderedDates).toBeSorted({ descending: true })
      })
    });
});

describe("GET /api/articles/:article_id",() => {
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

describe("GET /api/articles/:article_id/comments",() => {
  // Happy path test. 
  it("200: Returns an array of all comments for specified article.", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
      const { article_comments } = body
      expect(article_comments).toHaveLength(11)
      article_comments.forEach((comment) => {
        expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        body: expect.any(String),
        article_id: expect.any(Number),
        author: expect.any(String),
        votes: expect.any(Number),
        created_at: expect.any(String)
        })
      }) 
    })
  });

  it("200: Returns an empty array if the requested article exists but has no comments.", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({ body }) => {
      const { article_comments } = body
      expect(article_comments).toEqual([])
    })
  });

  it("400: responds with a 'Bad Request' error message when given an invalid article id", () => {
    return request(app)
    .get('/api/articles/one/comments')
    .expect(400)
    .then( ({ body }) => {
      expect(body.msg).toBe("Bad Request")
    });
  });

  it("404: sends an 'Inexistent Article' error message when given a valid but non-existent id'", () => {
    return request(app)
    .get('/api/articles/6000/comments')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Inexistent Article")
    })
  });
  
});

describe("POST /api/articles/:article_id/comments",() => {
  it("201: returns the posted comment when provided one by post request.", () => {
    const commentToPost = {
      author : "butter_bridge",
      body: "Maybe, like a cat you've seen something minute on the wall."
    }
    return request(app)
    .post("/api/articles/11/comments")
    .send(commentToPost)
    .expect(201)
    .then(({ body }) => {
      const { postedComment } = body
      expect(postedComment).toMatchObject(
        {
          comment_id: 19,
          author: "butter_bridge",
          body: "Maybe, like a cat you've seen something minute on the wall."
        }
      )
    })
  });
  
  it("400: responds with a 'Bad Request' error message when given an inexistent author.", () => {
    const commentToPost = {
      author: "Gerry",
      body: "Maybe, like a cat you've seen something minute on the wall."
    }
    return request(app)
    .post("/api/articles/11/comments")
    .send(commentToPost)
    .expect(400)
    .then( ({ body }) => {
    expect(body.msg).toBe("Bad Request")
    });
  });

  it("400: responds with a 'Required value must not be null' error message when given an empty required input.", () => {
    const commentToPost = {
      author: "butter_bridge"
    }
    return request(app)
    .post("/api/articles/11/comments")
    .send(commentToPost)
    .expect(400)
    .then( ({ body }) => {
    expect(body.msg).toBe("Required value must not be null")
    });
  });

  it("400: sends a 'Bad Request' error message when given a valid but inexistent article", () => {
    const commentToPost = {
      author: "butter_bridge",
      body: "Maybe, like a cat you've seen something minute on the wall."
    }
    return request(app)
    .post("/api/articles/6000/comments")
    .send(commentToPost)
    .expect(400)
    .then( ({ body }) => {
    expect(body.msg).toBe("Bad Request")
    });
  });
});

describe("/api/users",() => {
    // Happy path test:
    it("200: Should return an array of all users with correct properties.", () => {
      return request(app) // send request to app.
        .get("/api/users") //GET req to endpoint.
        .expect(200)
        .then(({ body }) => {
          const { allUsers } = body; //deconstruct users from body.
          expect(allUsers).toHaveLength(4); //length check
          allUsers.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            });
          }); //Object property check.
        });
    });
});