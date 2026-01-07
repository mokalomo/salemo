-- Using PostgreSQL ALTER COLUMN syntax instead of MySQL MODIFY
-- Add image columns to products table if not exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url VARCHAR(10000);

-- Add image columns to offers table if not exists
ALTER TABLE offers ADD COLUMN IF NOT EXISTS image_url VARCHAR(10000);

-- Extend column sizes to support base64 encoded images
ALTER TABLE games ALTER COLUMN thumbnail_url TYPE VARCHAR(10000);
ALTER TABLE products ALTER COLUMN image_url TYPE VARCHAR(10000);
ALTER TABLE offers ALTER COLUMN image_url TYPE VARCHAR(10000);
ALTER TABLE special_packs ALTER COLUMN image_url TYPE VARCHAR(10000);
