-- Migration to add size column to products table
-- This migration adds a size field to track the specific size of each resale item

-- Add size column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS size TEXT;

-- Update existing products with random sizes for demonstration
UPDATE products 
SET size = (ARRAY['Free size', 'XS', 'S', 'M', 'L', 'XL', 'XXL'])[floor(random() * 7 + 1)]
WHERE size IS NULL;
