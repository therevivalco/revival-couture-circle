-- Donations table
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 3),
    state_of_clothes VARCHAR(50) NOT NULL,
    age_of_item VARCHAR(50) NOT NULL,
    address_id INTEGER REFERENCES addresses(id),
    pickup_date DATE NOT NULL,
    pickup_type VARCHAR(20) NOT NULL CHECK (pickup_type IN ('home', 'dropoff')),
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    coupon_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Coupons table
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    discount_percentage INTEGER NOT NULL DEFAULT 10,
    valid_from TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    donation_id INTEGER REFERENCES donations(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_donations_user_email ON donations(user_email);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_coupons_user_email ON coupons(user_email);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_used ON coupons(used);
