\c nc_news_test

-- Tables:
-- comments
-- articles
-- users
-- topics

INSERT INTO comments
(body, article_id, author)
VALUES
('Maybe, like a cat you''ve seen something minute on the wall.', 
11, 
'butter_bridge')
RETURNING *;
