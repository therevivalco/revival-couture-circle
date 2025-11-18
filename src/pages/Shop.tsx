
import { useState, useEffect, useRef, forwardRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Search } from "lucide-react";
import ProductDetailModal from "@/components/ProductDetailModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useWishlist } from "../context/WishlistContext";

// Sample product data
const products = [
    {
        id: 1,
        name: "Cotton T-shirt",
        brand: "Lifestyle",
        material: "Pima Cotton",
        price: 840,
        originalPrice: 5600,
        condition: "Like New",
        image: "/assets/woman - tshirt1.jpg",
        category: "For Her",
      },
      {
        id: 2,
        name: "Short T-Shirt",
        brand: "H&M",
        material: "Polyester + Cotton",
        price: 600,
        originalPrice: 12000,
        condition: "Excellent",
        image: "/assets/woman - tshirt.jpg",
        category: "For Her",
      },
      {
        id: 3,
        name: "Baggy Jeans",
        brand: "Levi's",
        material: "Organic Denim",
        price: 940,
        originalPrice: 9600,
        condition: "Like New",
        image: "/assets/men - baggy jeans.jpg",
        category: "For Him",
      },
      {
        id: 4,
        name: "Merino Wool Scarf",
        brand: "Zara",
        material: "Merino Wool",
        price: 480,
        originalPrice: 7200,
        condition: "Excellent",
        image: "/assets/clothes.jpg",
        category: "Accessories",
      },
      {
        id: 5,
        name: "Linen Shirt",
        brand: "Marks & Spencer",
        material: "100% Linen",
        price: 840,
        originalPrice: 11200,
        condition: "Like New",
        image: "/assets/men - linen.jpg",
        category: "For Him",
      },
      {
        id: 6,
        name: "Polo T-shirt",
        brand: "Ralph Lauren",
        material: "Organic Cotton",
        price: 660,
        originalPrice: 15200,
        condition: "Like New",
        image: "/assets/men - polos.jpg",
        category: "For Him",
      },
      {
        id: 7,
        name: "Black Track Pants",
        brand: "Adidas",
        material: "Cotton + Polyester",
        price: 600,
        originalPrice: 8800,
        condition: "Good",
        image: "/assets/men - trousers.jpg",
        category: "For Him",
      },
      {
        id: 8,
        name: "Cotton Polo Sweater",
        brand: "Uniqlo",
        material: "Organic Cotton",
        price: 640,
        originalPrice: 9600,
        condition: "Excellent",
        image: "/assets/men - sweatshirt.jpg",
        category: "For Him",
      },
      {
        id: 9,
        name: "White Flared Pants",
        brand: "Zara",
        material: "Cotton",
        price: 720,
        originalPrice: 10400,
        condition: "Like New",
        image: "/assets/woman - White Flared Pants.jpg",
        category: "For Her",
      },
      {
        id: 10,
        name: "Baggy Jeans",
        brand: "Mango",
        material: "Denim",
        price: 760,
        originalPrice: 11200,
        condition: "Excellent",
        image: "/assets/woman - baggy jeans.jpg",
        category: "For Her",
      },
      {
        id: 11,
        name: "Crop Top",
        brand: "Forever 21",
        material: "Cotton",
        price: 280,
        originalPrice: 4000,
        condition: "Good",
        image: "/assets/woman - crop top.jpg",
        category: "For Her",
      },
      {
        id: 12,
        name: "Jumpsuit",
        brand: "Mango",
        material: "Linen",
        price: 880,
        originalPrice: 12800,
        condition: "Like New",
        image: "/assets/woman - jumpsuits.jpg",
        category: "For Her",
      },
      {
        id: 13,
        name: "Sundress",
        brand: "H&M",
        material: "Cotton",
        price: 680,
        originalPrice: 9600,
        condition: "Excellent",
        image: "/assets/woman - sundress.jpg",
        category: "For Her",
      },
      {
        id: 14,
        name: "Sweater",
        brand: "Zara",
        material: "Wool",
        price: 800,
        originalPrice: 11200,
        condition: "Like New",
        image: "/assets/woman - sweaters.jpg",
        category: "For Her",
      },
      {
        id: 15,
        name: "Polo Neck Hoodie",
        brand: "Nike",
        material: "Modal Cotton",
        price: 560,
        originalPrice: 8800,
        condition: "Good",
        image: "/assets/men - hoodie.jpg",
        category: "For Him",
      },
      {
        id: 16,
        name: "Leather Biker Jacket",
        brand: "AllSaints",
        material: "Leather",
        price: 1120,
        originalPrice: 18000,
        condition: "Excellent",
        image: "/assets/men - jacket.jpg",
        category: "For Him",
      },
      {
        id: 17,
        name: "Straight Fit Jeans",
        brand: "Levi's",
        material: "Denim",
        price: 720,
        originalPrice: 10400,
        condition: "Like New",
        image: "/assets/men - jeans.jpg",
        category: "For Him",
      },
      {
        id: 18,
        name: "2- Piece Linen Suit",
        brand: "Hugo Boss",
        material: "Linen",
        price: 2800,
        originalPrice: 28000,
        condition: "Excellent",
        image: "/assets/men - linen suit.jpg",
        category: "For Him",
      },
      {
        id: 19,
        name: "Popcorn T-Shirt",
        brand: "Zara",
        material: "Cotton",
        price: 440,
        originalPrice: 6400,
        condition: "Good",
        image: "/assets/men - polo shirt.jpg",
        category: "For Him",
      },
      {
        id: 20,
        name: "Dungarees",
        brand: "Gap Kids",
        material: "Denim",
        price: 490,
        originalPrice: 8000,
        condition: "Excellent",
        image: "/assets/kids - dungrees.jpg",
        category: "Kids",
      },
      {
        id: 21,
        name: "Girl's Frock",
        brand: "H&M Kids",
        material: "Cotton",
        price: 360,
        originalPrice: 5600,
        condition: "Like New",
        image: "/assets/kids - frock.jpg",
        category: "Kids",
      },
      {
        id: 22,
        name: "Girl's Blue Cord Set",
        brand: "Zara Kids",
        material: "Cotton",
        price: 600,
        originalPrice: 8800,
        condition: "Like New",
        image: "/assets/kids - outfits.jpg",
        category: "Kids",
      },
      {
        id: 23,
        name: "Bag",
        brand: "Coach",
        material: "Leather",
        price: 960,
        originalPrice: 14400,
        condition: "Good",
        image: "/assets/accesory - bag.jpg",
        category: "Accessories",
      },
      {
        id: 24,
        name: "Bracelet Set",
        brand: "Accessorize",
        material: "Mixed Metals",
        price: 320,
        originalPrice: 4800,
        condition: "Like New",
        image: "/assets/accesory - bracelet sets.jpg",
        category: "Accessories",
      },
      {
        id: 25,
        name: "Clutch",
        brand: "Mango",
        material: "PVC Plastic",
        price: 60,
        originalPrice: 9600,
        condition: "Excellent",
        image: "/assets/accesory - clutch.jpg",
        category: "Accessories",
      },
      {
        id: 26,
        name: "Kurti",
        brand: "Fabindia",
        material: "Synthetic Blend",
        price: 880,
        originalPrice: 12800,
        condition: "Like New",
        image: "/assets/woman - kurti.jpg",
        category: "For Her",
      },
      {
        id: 27,
        name: "Short Kurti",
        brand: "Global Desi",
        material: "Cotton",
        price: 680,
        originalPrice: 10400,
        condition: "Excellent",
        image: "/assets/woman - kurti2.jpg",
        category: "For Her",
      },
      {
        id: 28,
        name: "Off-Shoulder Crop Top",
        brand: "Forever 21",
        material: "Cotton",
        price: 800,
        originalPrice: 11200,
        condition: "Like New",
        image: "/assets/woman - crop top1.jpg",
        category: "For Her",
      },
      {
        id: 29,
        name: "Men's Ring",
        brand: "Tanishq",
        material: "Metal and Stone",
        price: 360,
        originalPrice: 5600,
        condition: "Excellent",
        image: "/assets/accesory - men ring.jpg",
        category: "Accessories",
      },
      {
        id: 30,
        name: "Necklace",
        brand: "Tanishq",
        material: "Gold plated Silver",
        price: 600,
        originalPrice: 8800,
        condition: "Like New",
        image: "/assets/accesory - necklace.jpg",
        category: "Accessories",
      },
      {
        id: 31,
        name: "Imitation Ring",
        brand: "Accessorize",
        material: "Silver",
        price: 400,
        originalPrice: 14400,
        condition: "Excellent",
        image: "/assets/accesory - ring.jpg",
        category: "Accessories",
      },
      {
        id: 32,
        name: "Men's Wallet",
        brand: "Tommy Hilfiger",
        material: "Genuine Leather",
        price: 320,
        originalPrice: 4800,
        condition: "Good",
        image: "/assets/accesory - wallet.jpg",
        category: "Accessories",
      },
      {
        id: 33,
        name: "Women's Leather Belt",
        brand: "Zara",
        material: "Genuine Leather",
        price: 640,
        originalPrice: 9600,
        condition: "Like New",
        image: "/assets/accesory - woman belt.jpg",
        category: "Accessories",
      },
      {
        id: 34,
        name: "PJs Set",
        brand: "Gap Kids",
        material: "Pure Cotton",
        price: 360,
        originalPrice: 5600,
        condition: "Excellent",
        image: "/assets/kids - pjs.jpg",
        category: "Kids",
      },
      {
        id: 35,
        name: "Boys Superhero Set",
        brand: "Marvel",
        material: "Synthetic Blend",
        price: 600,
        originalPrice: 8800,
        condition: "Like New",
        image: "/assets/kids - captain america.jpg",
        category: "Kids",
      },
];

const categoryHighlights = [
    { name: "For Her", image: "/assets/for her.jpg" },
    { name: "For Him", image: "/assets/for him.png" },
    { name: "For Kids", image: "/assets/for kids.jpg" },
    { name: "Accessories", image: "/assets/accesories.jpg" },
];

const MotionButton = motion(Button);
const MotionHeart = motion(Heart);

const ProductCard = ({ product, onProductClick }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }
  };

  return (
    <motion.div
      className="group cursor-pointer"
      onClick={() => onProductClick(product)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-neutral-100">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        <MotionHeart
          className={`absolute top-3 right-3 h-6 w-6 text-white cursor-pointer drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100`}
          onClick={handleWishlistClick}
          variants={{
            initial: { scale: 1, fill: "transparent" },
            toggled: { scale: 1, fill: "#fff", color: "#fff" },
          }}
          initial="initial"
          animate={isWishlisted ? "toggled" : "initial"}
          transition={{ duration: 0.2, ease: "easeIn" }}
        />
        {showHeartAnimation && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 2.5] }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Heart className="h-20 w-20 fill-white text-white" />
          </motion.div>
        )}
      </div>
      <div className="space-y-1 text-center">
        <h3 className="text-base font-sans">{product.name}</h3>
        <p className="text-sm text-neutral-500">{product.material}</p>
        <p className="text-base font-medium">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </motion.div>
  );
};

interface ProductCarouselProps {
  title: string;
  products: any[];
  onProductClick: (product: any) => void;
}

const ProductCarousel = forwardRef<HTMLElement, ProductCarouselProps>(({ title, products, onProductClick }, ref) => {
    const carouselRef = useRef(null);
  
    return (
      <section ref={ref} className="py-12">
        <h2 className="text-4xl font-serif text-center mb-8">{title}</h2>
        <div className="relative">
          <motion.div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-4 -mb-4 scrollbar-hide">
            {products.map((product) => (
              <div key={product.id} className="w-[280px] flex-shrink-0">
                <ProductCard product={product} onProductClick={onProductClick} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    );
});

ProductCarousel.displayName = "ProductCarousel";
  
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleProducts, setVisibleProducts] = useState(6);

  const heroRef = useRef(null);
  const forHerRef = useRef(null);
  const forHimRef = useRef(null);
  const kidsRef = useRef(null);
  const accessoriesRef = useRef(null);
  const catalogRef = useRef(null);

  const sectionRefs = {
    "For Her": forHerRef,
    "For Him": forHimRef,
    "Kids": kidsRef,
    "Accessories": accessoriesRef,
  };

  const handleScrollTo = (ref) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100, // Adjusted for sticky header
        behavior: "smooth",
      });
    }
  };

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "-50%"]);

  useEffect(() => {
    const category = searchParams.get("category");
    setActiveFilter(category || "All");
  }, [searchParams]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleFilterClick = (filter) => {
    setVisibleProducts(6);
    if (filter === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: filter });
    }
    handleScrollTo(catalogRef);
  };

  const handleCategoryClick = (category) => {
    const targetRef = sectionRefs[category];
    if (targetRef) {
        handleScrollTo(targetRef)
    }
  };

  const sortProducts = (productsToSort) => {
    const sorted = [...productsToSort];
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      default: // newest
        return sorted.sort((a, b) => b.id - a.id);
    }
  };
  
  const filteredProducts = products.filter(p => activeFilter === "All" || p.category === activeFilter);
  const displayedProducts = sortProducts(filteredProducts);

  return (
    <div className="bg-[#FDFDF9] text-neutral-800 font-sans">
      <Navigation />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative h-[85vh] flex items-center justify-center overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/hero-image.jpg')",
            y: parallaxY,
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          className="relative z-10 text-center text-white p-4"
          style={{ opacity: textOpacity, y: textY }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-serif mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            Conscious Craft, Timeless Design.
          </motion.h1>
          <motion.p
            className="text-base md:text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Discover our new collection of sustainably made, timeless pieces designed to last a lifetime.
          </motion.p>
          <MotionButton
            className="mt-8 rounded-full bg-olive px-8 py-3 text-base font-medium text-white transition-colors hover:bg-olive/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            onClick={() => handleScrollTo(catalogRef)}
          >
            Discover the Collection
          </MotionButton>
        </motion.div>
      </motion.section>
      
      <main className="container mx-auto px-4 md:px-8">
        {/* Category Highlights */}
        <section className="py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {categoryHighlights.map(cat => (
                    <motion.div 
                        key={cat.name} 
                        className="relative rounded-lg overflow-hidden group aspect-[3/4] md:aspect-[4/5] cursor-pointer"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        onClick={() => handleCategoryClick(cat.name)}
                    >
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                            <h3 className="text-2xl font-serif mb-2">{cat.name}</h3>
                            <Button variant="link" className="text-white p-0 h-auto font-semibold group-hover:underline">Shop Now</Button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* Category Carousels */}
        <ProductCarousel ref={forHerRef} title="For Her" products={products.filter(p => p.category === 'For Her')} onProductClick={handleProductClick} />
        <ProductCarousel ref={forHimRef} title="For Him" products={products.filter(p => p.category === 'For Him')} onProductClick={handleProductClick} />
        <ProductCarousel ref={kidsRef} title="Kids" products={products.filter(p => p.category === 'Kids')} onProductClick={handleProductClick} />
        <ProductCarousel ref={accessoriesRef} title="Accessories" products={products.filter(p => p.category === 'Accessories')} onProductClick={handleProductClick} />

        {/* Product Catalog Section */}
        <section ref={catalogRef} className="py-12">
            <div className="sticky top-[60px] bg-[#FDFDF9]/80 backdrop-blur-sm z-20 py-4 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span>Filter:</span>
                        {["All", "For Her", "For Him", "Kids", "Accessories"].map(filter => (
                            <Button
                                key={filter}
                                variant="ghost"
                                className={`rounded-full px-4 h-8 text-sm ${activeFilter === filter ? "bg-neutral-200" : ""}`}
                                onClick={() => handleFilterClick(filter)}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-48">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500"/>
                            <Input placeholder="Search" className="rounded-full pl-9 h-9"/>
                        </div>
                        <Select onValueChange={setSortBy} defaultValue={sortBy}>
                            <SelectTrigger className="w-40 rounded-full h-9">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="price-asc">Price: Low–High</SelectItem>
                                <SelectItem value="price-desc">Price: High–Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10"
            >
              {displayedProducts.slice(0, visibleProducts).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))}
            </motion.div>

            {visibleProducts < displayedProducts.length && (
                <div className="text-center mt-12">
                    <Button 
                        variant="outline" 
                        className="rounded-full px-8"
                        onClick={() => setVisibleProducts(prev => prev + 6)}
                    >
                        Load More
                    </Button>
                </div>
            )}
        </section>
      </main>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default Shop;
