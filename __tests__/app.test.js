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
const { expect } = require("@jest/globals");

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

describe("GET /api/articles (topic query)",() => {
  it("200: Should filter the articles by topic specified in the query.", () => {
    return request(app) // send request to app.
      .get("/api/articles?topic=cats") //GET req to endpoint.
      .expect(200)
      .then(({ body }) => {
        const { articlesWithTopic } = body; //deconstruct articles from body.
        expect(articlesWithTopic).toHaveLength(1); //length check
        expect(articlesWithTopic).toEqual(
          [
            {
              article_id: 5,
              title: 'UNCOVERED: catspiracy to bring down democracy',
              topic: 'cats',
              author: 'rogersop',
              body: 'Bastet walks amongst us, and the cats are taking arms!',
              created_at: '2020-08-03T13:14:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            }
          ]
        )
      });
  });

  it("200: Should filter the articles by topic specified in the query. If there are multiple articles with specified topic, should return an array of them", () => {
    return request(app) // send request to app.
      .get("/api/articles?topic=mitch") //GET req to endpoint.
      .expect(200)
      .then(({ body }) => {
        const { articlesWithTopic } = body; //deconstruct articles from body.
        expect(articlesWithTopic).toHaveLength(12); //length check
        expect(articlesWithTopic).toEqual(
          [
            {
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: '2020-07-09T20:11:00.000Z',
              votes: 100,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            },
            {
              article_id: 2,
              title: 'Sony Vaio; or, The Laptop',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
              created_at: '2020-10-16T05:03:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            },
            {
              article_id: 3,
              title: 'Eight pug gifs that remind me of mitch',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'some gifs',
              created_at: '2020-11-03T09:12:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            },
            {
              article_id: 4,
              title: 'Student SUES Mitch!',
              topic: 'mitch',
              author: 'rogersop',
              body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
              created_at: '2020-05-06T01:14:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            },
            {
              article_id: 6,
              title: 'A',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'Delicious tin of cat food',
              created_at: '2020-10-18T01:00:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            },
            {
              article_id: 7,
              title: 'Z',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'I was hungry.',
              created_at: '2020-01-07T14:08:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            },
            {
              article_id: 8,
              title: 'Does Mitch predate civilisation?',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!',
              created_at: '2020-04-17T01:08:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            },
            {
              article_id: 9,
              title: "They're not exactly dogs, are they?",
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'Well? Think about it.',
              created_at: '2020-06-06T09:10:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            },
            {
              article_id: 10,
              title: 'Seven inspirational thought leaders from Manchester UK',
              topic: 'mitch',
              author: 'rogersop',
              body: "Who are we kidding, there is only one, and it's Mitch!",
              created_at: '2020-05-14T04:15:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            },
            {
              article_id: 11,
              title: 'Am I a cat?',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?',
              created_at: '2020-01-15T22:21:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            },
            {
              article_id: 12,
              title: 'Moustache',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'Have you seen the size of that thing?',
              created_at: '2020-10-11T11:24:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            },
            {
              article_id: 13,
              title: 'Another article about Mitch',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'There will never be enough articles about Mitch!',
              created_at: '2020-10-11T11:24:00.000Z',
              votes: 0,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            }
          ]
        )
      });
  });

  it("200: Should return an empty array if topic exists but has 0 articles.", () => {
    return request(app) // send request to app.
      .get("/api/articles?topic=paper") //GET req to endpoint.
      .expect(200)
      .then(({ body }) => {
        const { articlesWithTopic } = body; //deconstruct articles from body.
        expect(articlesWithTopic).toHaveLength(0); //length check
        expect(articlesWithTopic).toEqual([])
      });
  });
  

  it("404: sends an 'Inexistent Topic' error message when given a valid but non-existent topic'", () => {
    return request(app)
    .get('/api/articles?topic=birds')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Inexistent Topic")
    })
  });
});

describe("DELETE /api/comments/:comment_id",() => {
  it("204: Deletes the given comment by id", () => {
    return request(app)
    .delete("/api/comments/5")
    .expect(204)
    })

    it("404: sends an 'Inexistent Comment' error message when given a valid but non-existent comment_id'", () => {
      return request(app)
      .delete('/api/comments/6000')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Inexistent Comment")
      })
    });

    it("400: sends a 'Bad Request' error message when given an invalid comment id", () => {
      return request(app)
      .delete("/api/comments/invalid-id")
      .expect(400)
      .then( ({ body }) => {
      expect(body.msg).toBe("Bad Request")
      });
    })
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