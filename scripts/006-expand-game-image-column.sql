-- Expand thumbnail_url to allow larger base64 images
ALTER TABLE games
ALTER COLUMN thumbnail_url TYPE TEXT;
