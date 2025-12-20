-- Addresses table
CREATE TABLE addresses (
  id BIGSERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_addresses_user_email ON addresses(user_email);

-- Ensure only one default address per user
CREATE UNIQUE INDEX idx_addresses_user_default ON addresses(user_email) WHERE is_default = TRUE;
