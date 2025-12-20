-- Rental Items Table
CREATE TABLE rental_items (
  id BIGSERIAL PRIMARY KEY,
  owner_email TEXT NOT NULL,
  
  -- Item Details
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT NOT NULL,
  condition TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  
  -- Rental Pricing
  rental_price_per_day NUMERIC NOT NULL,
  minimum_rental_days INTEGER NOT NULL DEFAULT 3,
  maximum_rental_days INTEGER,
  security_deposit NUMERIC NOT NULL,
  cleaning_fee_included BOOLEAN DEFAULT true,
  
  -- Availability
  available_from TIMESTAMP WITH TIME ZONE NOT NULL,
  available_till TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Pickup/Delivery
  pickup_method TEXT NOT NULL, -- 'shipping' or 'pickup'
  pickup_location TEXT,
  
  -- Status
  status TEXT DEFAULT 'available', -- 'available', 'rented', 'unavailable'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rental Bookings Table
CREATE TABLE rental_bookings (
  id BIGSERIAL PRIMARY KEY,
  rental_item_id BIGINT REFERENCES rental_items(id) ON DELETE CASCADE,
  renter_email TEXT NOT NULL,
  
  -- Booking Dates
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  rental_days INTEGER NOT NULL,
  
  -- Pricing
  rental_amount NUMERIC NOT NULL,
  security_deposit NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'active', 'completed', 'cancelled'
  
  -- Payment
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  
  -- Return Tracking
  return_status TEXT DEFAULT 'pending', -- 'pending', 'returned', 'late', 'damaged'
  return_date TIMESTAMP WITH TIME ZONE,
  deposit_refunded BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rental Availability/Blocked Dates Table
CREATE TABLE rental_availability (
  id BIGSERIAL PRIMARY KEY,
  rental_item_id BIGINT REFERENCES rental_items(id) ON DELETE CASCADE,
  booking_id BIGINT REFERENCES rental_bookings(id) ON DELETE CASCADE,
  
  blocked_from TIMESTAMP WITH TIME ZONE NOT NULL,
  blocked_till TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT, -- 'booked', 'maintenance', 'owner_blocked'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_rental_items_owner ON rental_items(owner_email);
CREATE INDEX idx_rental_items_status ON rental_items(status);
CREATE INDEX idx_rental_items_category ON rental_items(category);
CREATE INDEX idx_rental_bookings_renter ON rental_bookings(renter_email);
CREATE INDEX idx_rental_bookings_item ON rental_bookings(rental_item_id);
CREATE INDEX idx_rental_bookings_status ON rental_bookings(status);
CREATE INDEX idx_rental_availability_item ON rental_availability(rental_item_id);
CREATE INDEX idx_rental_availability_dates ON rental_availability(blocked_from, blocked_till);
