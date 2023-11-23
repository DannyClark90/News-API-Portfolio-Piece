\c nc_news_test

-- Tables:
-- comments
-- articles
-- users
-- topics

UPDATE articles
SET votes = votes + 5
WHERE article_id = 2
RETURNING *;
