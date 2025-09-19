-- Create storage buckets for manga content
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('manga-covers', 'manga-covers', true),
  ('manga-pages', 'manga-pages', true);

-- Create RLS policies for manga covers bucket
CREATE POLICY "Anyone can view manga covers" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'manga-covers');

CREATE POLICY "Authenticated users can upload manga covers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'manga-covers' AND auth.role() = 'authenticated');

-- Create RLS policies for manga pages bucket  
CREATE POLICY "Anyone can view manga pages" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'manga-pages');

CREATE POLICY "Authenticated users can upload manga pages" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'manga-pages' AND auth.role() = 'authenticated');

-- Insert real manga data
INSERT INTO manga (title, slug, description, author, artist, status, rating, view_count, genres, tags, cover_image_url) VALUES
('Tower of God', 'tower-of-god', 'Tower of God centers around a boy called Twenty-fifth Bam, who has spent most of his life trapped beneath a vast and mysterious Tower, with only his close friend, Rachel, to keep him company. When Rachel enters the Tower, Bam manages to open the door into it as well, and faces challenges at each floor of this tower as he tries to find his closest companion.', 'SIU', 'SIU', 'ongoing', 4.8, 8500000, ARRAY['Action', 'Adventure', 'Drama', 'Fantasy', 'Mystery', 'Supernatural', 'Webtoon'], ARRAY['Tower', 'Climbing', 'Powers', 'Friendship'], 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=400&h=600&fit=crop'),

('Solo Leveling', 'solo-leveling', 'In a world where hunters battle deadly monsters that emerge from gates connecting our world to other dimensions, Sung Jin-Woo is known as the weakest E-rank hunter. Despite his low rank, he continues to hunt monsters to pay for his mothers medical bills. During a seemingly routine dungeon raid, Jin-Woo and his party discover a hidden dungeon.', 'Chugong', 'DUBU (REDICE STUDIO)', 'completed', 4.9, 12000000, ARRAY['Action', 'Adventure', 'Fantasy', 'Supernatural', 'Webtoon'], ARRAY['Leveling', 'Monsters', 'Powers', 'Strong MC'], 'https://images.unsplash.com/photo-1626618012641-bfbca5031651?w=400&h=600&fit=crop'),

('The Beginning After The End', 'the-beginning-after-the-end', 'King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power. Beneath the glamorous exterior of a powerful king lurks the shell of man, devoid of purpose and will. Reincarnated into a new world filled with magic and monsters, the king has a second chance to relive his life.', 'TurtleMe', 'Fuyuki23', 'ongoing', 4.7, 6500000, ARRAY['Action', 'Adventure', 'Fantasy', 'Magic', 'Webtoon'], ARRAY['Reincarnation', 'Magic', 'Academy', 'Strong MC'], 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'),

('Omniscient Readers Viewpoint', 'omniscient-readers-viewpoint', 'Dokja was an average office worker whose sole interest was reading his favorite web novel Three Ways to Survive the Apocalypse. But when the novel suddenly becomes reality, he is the only person who knows how the world will end. Armed with this realization, Dokja uses his understanding to change the course of the story, and the world, as he knows it.', 'Sing Shong', 'UMI', 'ongoing', 4.6, 4200000, ARRAY['Action', 'Adventure', 'Fantasy', 'Psychological', 'Webtoon'], ARRAY['Apocalypse', 'System', 'Smart MC'], 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=400&h=600&fit=crop');