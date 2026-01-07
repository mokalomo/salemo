-- Create default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (email, password_hash, full_name, role)
VALUES (
  'admin@paygames.com',
  '$2a$10$8K1p/a0dL3.HsVwx5KQFX.N7V5zgHLYLBpWjA5KwZPQqmLxJz8fgG',
  'Admin User',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
