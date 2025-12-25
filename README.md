# The Revival Co. 🌿

A sustainable fashion marketplace platform that enables users to buy, sell, rent, auction, and donate pre-loved clothing. Built with a focus on conscious consumption and circular fashion economy.

![The Revival Co.](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)

## 🌟 Features

### 🛍️ Shop
- Browse collections of sustainable fashion
- Advanced filtering by category, size, and product type
- Real-time search functionality
- Wishlist management with authentication
- Product detail modals with image galleries
- Responsive grid layout with smooth animations

### � Sell Your Items
- List pre-loved clothing for sale
- Upload photos and detailed product information
- Set your own pricing
- Authentication and verification process
- Manage your listings with edit/delete capabilities
- Track sales and earnings
- Hassle-free shipping with prepaid labels

### �👗 Rental System
- List clothing items for rent
- Set rental duration and pricing
- Manage rental listings with edit/delete capabilities
- Browse available rentals with detailed information
- Secure rental booking process

### 🎯 Auction Platform
- Create time-limited auctions for unique pieces
- Real-time bidding system
- Automatic auction expiration handling
- Bid history tracking
- Manage your active auctions

### 💝 Donation Portal
- Donate pre-loved clothing to charitable causes
- Support various NGOs and community organizations
- Track donation history
- Impact metrics and transparency

### 🛒 E-Commerce Features
- Shopping cart with persistent storage
- Secure checkout process
- Multiple address management
- Order tracking and history
- Coupon/discount code system
- Order success confirmation

### 👤 User Account Management
- Secure authentication via Supabase
- Profile management
- Address book
- Order history
- Wishlist synchronization
- My Products dashboard (sell, rent, auction)

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: shadcn/ui with Radix UI primitives
- **Animations**: Framer Motion 12.23.24, GSAP 3.13.0
- **Routing**: React Router DOM 6.30.1
- **State Management**: React Query (TanStack Query) 5.83.0
- **Forms**: React Hook Form 7.61.1 with Zod validation
- **Smooth Scrolling**: Lenis by Studio Freight

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.19.2
- **Database**: Supabase (PostgreSQL)
- **File Upload**: Multer 2.0.2
- **CORS**: Enabled for cross-origin requests

### Database & Authentication
- **Supabase**: PostgreSQL database with real-time capabilities
- **Authentication**: Supabase Auth with JWT tokens
- **Storage**: Supabase Storage for images and media

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Clone the Repository
```bash
git clone <repository-url>
cd revival-couture-circle
```

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the root directory:
```bash
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the server directory:
```bash
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

4. Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:3000`

### Run Both Servers Concurrently

From the root directory:
```bash
npm run dev:all
```

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Run the SQL migrations from the `database` folder in your Supabase SQL Editor

3. Enable Row Level Security (RLS) policies as needed

4. Configure Storage buckets for product images:
   - `product-images`
   - `rental-images`
   - `auction-images`
   - `donation-images`

## 📁 Project Structure

```
revival-couture-circle/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Navigation.tsx  # Main navigation
│   │   ├── Footer.tsx      # Footer component
│   │   └── ...
│   ├── pages/              # Route pages
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── Rent.tsx
│   │   ├── Auction.tsx
│   │   ├── Donate.tsx
│   │   └── ...
│   ├── context/            # React Context providers
│   ├── lib/                # Utility functions
│   └── integrations/       # Third-party integrations
├── server/
│   ├── index.js           # Express server
│   ├── database.js        # Database operations
│   ├── rental-database.js # Rental-specific DB ops
│   ├── donation-database.js # Donation-specific DB ops
│   └── ...
├── public/                # Static assets
└── database/              # SQL migrations
```


## 🚢 Deployment

Detailed deployment instructions are available in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Quick Deploy

**Frontend (Vercel)**:
```bash
npm run build
# Deploy to Vercel
```

**Backend (Render)**:
- Push to GitHub
- Connect repository to Render
- Set environment variables
- Deploy

## 🛠️ Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm start           # Start production server
npm run dev         # Start development server with auto-reload
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Backend (server/.env)
```
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**:
- Ensure backend CORS is configured correctly
- Check that `VITE_API_URL` points to the correct backend URL

**Authentication Issues**:
- Verify Supabase credentials
- Check redirect URLs in Supabase dashboard
- Clear browser cache and cookies

**Build Errors**:
- Delete `node_modules` and reinstall
- Clear Vite cache: `rm -rf node_modules/.vite`
- Ensure all environment variables are set

## 📄 License

This project is private and proprietary.

## 👥 Authors

The Revival Co. Team

## 🙏 Acknowledgments

- shadcn/ui for beautiful UI components
- Supabase for backend infrastructure
- Framer Motion for animation capabilities
- The open-source community

---

**Made with 💚 for a sustainable future**
