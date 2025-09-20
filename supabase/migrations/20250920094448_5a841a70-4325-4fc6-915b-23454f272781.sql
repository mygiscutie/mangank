-- Remove mock manga data and keep only the database structure
DELETE FROM chapters;
DELETE FROM manga;

-- Drop the mock storage buckets since we won't be using them for MangaDx integration
DELETE FROM storage.buckets WHERE id IN ('manga-covers', 'manga-content');

-- Update manga table to be ready for potential future use with real data
COMMENT ON TABLE manga IS 'Reserved for future local manga storage, currently using MangaDx API';
COMMENT ON TABLE chapters IS 'Reserved for future local chapter storage, currently using MangaDx API';