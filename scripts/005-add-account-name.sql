-- Add account_name to orders
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS account_name VARCHAR(255);

-- Optional: populate existing rows with a placeholder if needed
-- UPDATE orders SET account_name = NULL WHERE account_name IS NULL;
