import express from 'express';
import cors from 'cors';
import { getAllProducts } from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
