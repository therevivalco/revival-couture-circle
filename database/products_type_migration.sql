-- Migration to add product_type column to products table
-- This adds a product type field to categorize items (T-Shirts, Dresses, Pants, etc.)

-- Add product_type column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT;

-- Update existing products with product types based on their names
-- You can customize these or set them manually in Supabase
UPDATE products 
SET product_type = CASE
    WHEN LOWER(name) LIKE '%t-shirt%' OR LOWER(name) LIKE '%tshirt%' OR LOWER(name) LIKE '%tee%' THEN 'T-Shirts'
    WHEN LOWER(name) LIKE '%dress%' THEN 'Dresses'
    WHEN LOWER(name) LIKE '%jean%' OR LOWER(name) LIKE '%denim%' THEN 'Jeans'
    WHEN LOWER(name) LIKE '%pant%' OR LOWER(name) LIKE '%trouser%' THEN 'Pants'
    WHEN LOWER(name) LIKE '%shirt%' AND LOWER(name) NOT LIKE '%t-shirt%' THEN 'Shirts'
    WHEN LOWER(name) LIKE '%jacket%' OR LOWER(name) LIKE '%coat%' THEN 'Jackets'
    WHEN LOWER(name) LIKE '%shoe%' OR LOWER(name) LIKE '%sneaker%' OR LOWER(name) LIKE '%boot%' THEN 'Shoes'
    WHEN LOWER(name) LIKE '%bag%' OR LOWER(name) LIKE '%purse%' THEN 'Bags'
    WHEN LOWER(name) LIKE '%watch%' THEN 'Watches'
    WHEN LOWER(name) LIKE '%skirt%' THEN 'Skirts'
    WHEN LOWER(name) LIKE '%short%' THEN 'Shorts'
    WHEN LOWER(name) LIKE '%sweater%' OR LOWER(name) LIKE '%hoodie%' OR LOWER(name) LIKE '%sweatshirt%' THEN 'Sweaters'
    ELSE 'Other'
END
WHERE product_type IS NULL;
