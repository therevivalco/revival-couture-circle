import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, getAllProducts, createProduct, createAuction, getAllActiveAuctions, getAuctionById, placeBid, getAuctionBids, getAuctionsByUser, getBidsByUser, getProductsBySeller, updateProduct, deleteProduct, createOrder, getOrdersByUser, getOrderById, getAddressesByUser, createAddress, updateAddress, deleteAddress, setDefaultAddress } from './database.js';
import { createRentalItem, getAllRentalItems, getRentalItemById, getRentalsByOwner, checkRentalAvailability, createRentalBooking, getBookingsByRenter, getBookingsForRentalItem, updateBookingStatus, updateRentalItem, deleteRentalItem } from './rental-database.js';
import { createDonation, getUserDonations, getCouponsByUser, validateCoupon, useCoupon } from './donation-database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from public/uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Configure multer for memory storage (we'll upload to Supabase)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Routes
app.get('/api/products', (req, res) => {
    try {
        getAllProducts((products) => {
            res.json(products);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload image endpoint - now uses Supabase Storage
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('Uploading file:', req.file.originalname, 'Size:', req.file.size);

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + path.extname(req.file.originalname);

        console.log('Generated filename:', filename);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('Images')
            .upload(filename, req.file.buffer, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', JSON.stringify(error, null, 2));
            throw new Error(`Failed to upload image to storage: ${error.message}`);
        }

        console.log('Upload successful:', data);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('Images')
            .getPublicUrl(filename);

        console.log('Public URL:', publicUrl);

        res.json({ imageUrl: publicUrl });
    } catch (error) {
        console.error('Upload endpoint error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create product endpoint
app.post('/api/products', async (req, res) => {
    try {
        const { name, brand, material, price, originalPrice, condition, category, image, seller_id } = req.body;

        // Validate required fields
        if (!name || !brand || !material || !price || !originalPrice || !condition || !category || !image) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const productData = {
            name,
            brand,
            material,
            price: parseFloat(price),
            originalPrice: parseFloat(originalPrice),
            condition,
            category,
            image,
            seller_id: seller_id || 'anonymous'
        };

        const newProduct = await createProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auction endpoints
// Create auction
app.post('/api/auctions', async (req, res) => {
    try {
        const { seller_id, image, name, category, brand, size, condition, start_time, duration, minimum_bid } = req.body;

        // Validate required fields
        if (!seller_id || !image || !name || !category || !brand || !size || !condition || !start_time || !duration || !minimum_bid) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const auctionData = {
            seller_id,
            image,
            name,
            category,
            brand,
            size,
            condition,
            start_time,
            duration: parseInt(duration),
            minimum_bid: parseFloat(minimum_bid),
            current_bid: parseFloat(minimum_bid),
            status: 'active'
        };

        const newAuction = await createAuction(auctionData);
        res.status(201).json(newAuction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all active auctions
app.get('/api/auctions', async (req, res) => {
    try {
        const auctions = await getAllActiveAuctions();
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single auction
app.get('/api/auctions/:id', async (req, res) => {
    try {
        const auction = await getAuctionById(req.params.id);
        res.json(auction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Place bid
app.post('/api/auctions/:id/bid', async (req, res) => {
    try {
        const { bidder_id, bid_amount } = req.body;
        const auctionId = req.params.id;

        if (!bidder_id || !bid_amount) {
            return res.status(400).json({ error: 'Bidder ID and bid amount are required' });
        }

        // Get current auction to validate bid
        const auction = await getAuctionById(auctionId);

        if (parseFloat(bid_amount) <= parseFloat(auction.current_bid)) {
            return res.status(400).json({ error: 'Bid must be higher than current bid' });
        }

        const bidData = {
            auction_id: parseInt(auctionId),
            bidder_id,
            bid_amount: parseFloat(bid_amount),
            bid_time: new Date().toISOString()
        };

        const result = await placeBid(auctionId, bidData);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get auction bids
app.get('/api/auctions/:id/bids', async (req, res) => {
    try {
        const bids = await getAuctionBids(req.params.id);
        res.json(bids);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get auctions by user
app.get('/api/auctions/user/:email', async (req, res) => {
    try {
        const auctions = await getAuctionsByUser(req.params.email);
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bids by user
app.get('/api/auctions/bids/user/:email', async (req, res) => {
    try {
        const bids = await getBidsByUser(req.params.email);
        res.json(bids);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Product management endpoints
// Get products by seller
app.get('/api/products/user/:sellerId', async (req, res) => {
    try {
        const products = await getProductsBySeller(req.params.sellerId);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { name, brand, material, price, originalPrice, condition, category, image } = req.body;

        const productData = {};
        if (name) productData.name = name;
        if (brand) productData.brand = brand;
        if (material) productData.material = material;
        if (price) productData.price = parseFloat(price);
        if (originalPrice) productData.originalPrice = parseFloat(originalPrice);
        if (condition) productData.condition = condition;
        if (category) productData.category = category;
        if (image) productData.image = image;

        const updatedProduct = await updateProduct(req.params.id, productData);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await deleteProduct(req.params.id);
        res.json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Order endpoints
app.post('/api/orders', async (req, res) => {
    try {
        console.log('Creating order with data:', JSON.stringify(req.body, null, 2));
        const order = await createOrder(req.body);
        console.log('Order created successfully:', order);
        res.json(order);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders/user/:email', async (req, res) => {
    try {
        const orders = await getOrdersByUser(req.params.email);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await getOrderById(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Address endpoints
app.get('/api/addresses/user/:email', async (req, res) => {
    try {
        const addresses = await getAddressesByUser(req.params.email);
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/addresses', async (req, res) => {
    try {
        const address = await createAddress(req.body);
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/addresses/:id', async (req, res) => {
    try {
        const address = await updateAddress(req.params.id, req.body);
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/addresses/:id', async (req, res) => {
    try {
        const address = await deleteAddress(req.params.id);
        res.json({ message: 'Address deleted successfully', address });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/addresses/:id/default', async (req, res) => {
    try {
        const { user_email } = req.body;
        const address = await setDefaultAddress(req.params.id, user_email);
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rental endpoints
// Create rental listing
app.post('/api/rentals', upload.single('image'), async (req, res) => {
    try {
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const rentalData = {
            ...req.body,
            image: imageUrl,
            rental_price_per_day: parseFloat(req.body.rental_price_per_day),
            minimum_rental_days: parseInt(req.body.minimum_rental_days),
            maximum_rental_days: req.body.maximum_rental_days ? parseInt(req.body.maximum_rental_days) : null,
            security_deposit: parseFloat(req.body.security_deposit),
            cleaning_fee_included: req.body.cleaning_fee_included === 'true',
        };

        const rental = await createRentalItem(rentalData);
        res.json(rental);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all available rentals
app.get('/api/rentals', async (req, res) => {
    try {
        const rentals = await getAllRentalItems();
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get rental by ID
app.get('/api/rentals/:id', async (req, res) => {
    try {
        const rental = await getRentalItemById(req.params.id);
        res.json(rental);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get rentals by owner
app.get('/api/rentals/owner/:email', async (req, res) => {
    try {
        const rentals = await getRentalsByOwner(req.params.email);
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check availability
app.post('/api/rentals/:id/check-availability', async (req, res) => {
    try {
        const { start_date, end_date } = req.body;
        const availability = await checkRentalAvailability(req.params.id, start_date, end_date);
        res.json(availability);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create booking
app.post('/api/rentals/:id/book', async (req, res) => {
    try {
        const booking = await createRentalBooking(req.body);
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bookings by renter
app.get('/api/rentals/bookings/user/:email', async (req, res) => {
    try {
        const bookings = await getBookingsByRenter(req.params.email);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bookings for a rental item
app.get('/api/rentals/:id/bookings', async (req, res) => {
    try {
        const bookings = await getBookingsForRentalItem(req.params.id);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update booking status
app.put('/api/rentals/bookings/:id/status', async (req, res) => {
    try {
        const { status, ...updates } = req.body;
        const booking = await updateBookingStatus(req.params.id, status, updates);
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update rental item
app.put('/api/rentals/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Only update image if a new one was uploaded
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        // Parse numerical fields
        if (updateData.rental_price_per_day) {
            updateData.rental_price_per_day = parseFloat(updateData.rental_price_per_day);
        }
        if (updateData.minimum_rental_days) {
            updateData.minimum_rental_days = parseInt(updateData.minimum_rental_days);
        }
        if (updateData.maximum_rental_days) {
            updateData.maximum_rental_days = updateData.maximum_rental_days ? parseInt(updateData.maximum_rental_days) : null;
        }
        if (updateData.security_deposit) {
            updateData.security_deposit = parseFloat(updateData.security_deposit);
        }

        const rental = await updateRentalItem(req.params.id, updateData);
        res.json(rental);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete rental item
app.delete('/api/rentals/:id', async (req, res) => {
    try {
        const rental = await deleteRentalItem(req.params.id);
        res.json({ message: 'Rental deleted successfully', rental });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= DONATION ENDPOINTS =============

// Create donation
app.post('/api/donations', async (req, res) => {
    try {
        const donation = await createDonation(req.body);
        res.json(donation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user donations
app.get('/api/donations/user/:email', async (req, res) => {
    try {
        const donations = await getUserDonations(req.params.email);
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user coupons
app.get('/api/coupons/user/:email', async (req, res) => {
    try {
        const coupons = await getCouponsByUser(req.params.email);
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Validate coupon
app.post('/api/coupons/validate', async (req, res) => {
    try {
        const { code, userEmail } = req.body;
        const result = await validateCoupon(code, userEmail);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Use coupon
app.post('/api/coupons/use/:id', async (req, res) => {
    try {
        const coupon = await useCoupon(req.params.id);
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size cannot exceed 2MB' });
        }
    }
    res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
