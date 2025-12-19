import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, getAllProducts, createProduct, createAuction, getAllActiveAuctions, getAuctionById, placeBid, getAuctionBids, getProductsBySeller, updateProduct, deleteProduct } from './database.js';

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

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + path.extname(req.file.originalname);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('Images')
            .upload(filename, req.file.buffer, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new Error('Failed to upload image to storage');
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('Images')
            .getPublicUrl(filename);

        res.json({ imageUrl: publicUrl });
    } catch (error) {
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
