\c nc_news_test

-- Tables:
-- comments
-- articles
-- users
-- topics

SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)
FROM comments
JOIN articles
ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY created_at DESC;
