-- Add address_type column to addresses table
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS address_type TEXT DEFAULT 'Home';

-- Update existing addresses to have 'Home' as default type
UPDATE addresses SET address_type = 'Home' WHERE address_type IS NULL;
