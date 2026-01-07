-- Games Table
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table (items within games)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price NUMERIC(10, 2) NOT NULL,
  discount_price NUMERIC(10, 2),
  stock INTEGER DEFAULT -1,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(game_id, name)
);

-- Offers Table
CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  offer_type VARCHAR(50) NOT NULL,
  discount_value NUMERIC(10, 2) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Offer Products Junction Table (many-to-many)
CREATE TABLE IF NOT EXISTS offer_products (
  id SERIAL PRIMARY KEY,
  offer_id INTEGER NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(offer_id, product_id)
);

-- Special Packs Table
CREATE TABLE IF NOT EXISTS special_packs (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  original_price NUMERIC(10, 2) NOT NULL,
  pack_price NUMERIC(10, 2) NOT NULL,
  discount_percentage NUMERIC(5, 2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(game_id, name)
);

-- Pack Products Junction Table (many-to-many)
CREATE TABLE IF NOT EXISTS pack_products (
  id SERIAL PRIMARY KEY,
  pack_id INTEGER NOT NULL REFERENCES special_packs(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pack_id, product_id)
);

-- Create indexes for common queries
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_products_game_id ON products(game_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_offers_game_id ON offers(game_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_end_date ON offers(end_date);
CREATE INDEX idx_special_packs_game_id ON special_packs(game_id);
CREATE INDEX idx_special_packs_status ON special_packs(status);
