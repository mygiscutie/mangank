-- Add chapters for Tower of God
WITH manga_tower AS (SELECT id FROM manga WHERE slug = 'tower-of-god'),
     chapter_data AS (
       SELECT 
         m.id as manga_id,
         s.chapter_num,
         CASE 
           WHEN s.chapter_num = 1 THEN 'Headon'
           WHEN s.chapter_num = 2 THEN 'Ball'
           WHEN s.chapter_num = 179 THEN 'The Final Test'
           ELSE 'Chapter ' || s.chapter_num
         END as title,
         floor(random() * 50 + 10)::integer as pages_count,
         NOW() - (179 - s.chapter_num) * interval '1 week' as published_at,
         'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=800&h=1200&fit=crop&page=' || s.chapter_num as content_url
       FROM manga_tower m,
            generate_series(1, 179) s(chapter_num)
     )
INSERT INTO chapters (manga_id, chapter_number, title, pages_count, published_at, content_url)
SELECT manga_id, chapter_num, title, pages_count, published_at, content_url
FROM chapter_data;

-- Add chapters for Solo Leveling
WITH manga_solo AS (SELECT id FROM manga WHERE slug = 'solo-leveling'),
     chapter_data AS (
       SELECT 
         m.id as manga_id,
         s.chapter_num,
         CASE 
           WHEN s.chapter_num = 1 THEN 'The World''s Weakest Hunter'
           WHEN s.chapter_num = 2 THEN 'The Double Dungeon'
           WHEN s.chapter_num = 179 THEN 'The End of a Long Journey'
           ELSE 'Chapter ' || s.chapter_num
         END as title,
         floor(random() * 30 + 15)::integer as pages_count,
         NOW() - (179 - s.chapter_num) * interval '3 days' as published_at,
         'https://images.unsplash.com/photo-1626618012641-bfbca5031651?w=800&h=1200&fit=crop&page=' || s.chapter_num as content_url
       FROM manga_solo m,
            generate_series(1, 179) s(chapter_num)
     )
INSERT INTO chapters (manga_id, chapter_number, title, pages_count, published_at, content_url)
SELECT manga_id, chapter_num, title, pages_count, published_at, content_url
FROM chapter_data;