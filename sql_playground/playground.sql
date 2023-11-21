\c nc_news_test

-- Tables:
-- comments
-- articles
-- users
-- topics

SELECT * FROM comments
WHERE article_id = 1
ORDER BY created_at DESC;
