
import { useState, useEffect, useRef } from "react";
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

// Sample product data
const products = [
    {
        id: 1,
        name: "Organic Pima Tee",
        material: "Pima Cotton",
        price: 48,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=600&fit=crop",
        category: "For Her",
      },
      {
        id: 2,
        name: "Vegan Leather Jacket",
        material: "Recycled PU",
        price: 120,
        image: "/src/assets/jacket.jpg",
        category: "For Her",
      },
      {
        id: 3,
        name: "Straight-Leg Denim",
        material: "Organic Denim",
        price: 88,
        image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500&h=600&fit=crop",
        category: "For Him",
      },
      {
        id: 4,
        name: "Merino Wool Scarf",
        material: "Merino Wool",
        price: 60,
        image: "/src/assets/clothes.jpg",
        category: "Accessories",
      },
      {
        id: 5,
        name: "The Everyday Sneaker",
        material: "Recycled Materials",
        price: 105,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=600&fit=crop",
        category: "For Him",
      },
      {
        id: 6,
        name: "Peace Silk Blouse",
        material: "Ahimsa Silk",
        price: 145,
        image: "https://images.unsplash.com/photo-1581655353564-df123a43e246?w=500&h=600&fit=crop",
        category: "For Her",
      },
      {
        id: 7,
        name: "Linen Trousers",
        material: "100% Linen",
        price: 75,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop",
        category: "For Her",
      },
      {
        id: 8,
        name: "Cotton Crewneck Sweater",
        material: "Organic Cotton",
        price: 80,
        image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=500&h=600&fit=crop",
        category: "For Him",
      },
];

const categoryHighlights = [
    { name: "For Her", image: "/src/assets/image1.png" },
    { name: "For Him", image: "/src/assets/denim-jacket.jpg.png" },
    { name: "For Kids", image: "/src/assets/kid.jpg" },
    { name: "Accessories", image: "/src/assets/boots.jpg" },
];

const MotionButton = motion(Button);
const MotionHeart = motion(Heart);

const ProductCard = ({ product, onProductClick }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

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
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          variants={{
            initial: { scale: 1,  fill: "transparent" },
            toggled: { scale: 1, fill: "#000", color: "#000" },
          }}
          initial="initial"
          animate={isWishlisted ? "toggled" : "initial"}
          transition={{ duration: 0.2, ease: "easeIn" }}
        />
      </div>
      <div className="space-y-1 text-center">
        <h3 className="text-base font-sans">{product.name}</h3>
        <p className="text-sm text-neutral-500">{product.material}</p>
        <p className="text-base font-medium">£{product.price}</p>
      </div>
    </motion.div>
  );
};

const ProductCarousel = ({ title, products, onProductClick }) => {
    const carouselRef = useRef(null);
  
    return (
      <section className="py-12">
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
};
  
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleProducts, setVisibleProducts] = useState(6);

  const heroRef = useRef(null);
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
    setVisibleProducts(6); // Reset visible products on filter change
    if (filter === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: filter });
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
            backgroundImage: "url('/src/assets/hero-image.jpg')",
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
                        className="relative rounded-lg overflow-hidden group aspect-[3/4] md:aspect-[4/5]"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
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
        <ProductCarousel title="For Her" products={products.filter(p => p.category === 'For Her')} onProductClick={handleProductClick} />
        <ProductCarousel title="For Him" products={products.filter(p => p.category === 'For Him')} onProductClick={handleProductClick} />


        {/* Product Catalog Section */}
        <section className="py-12">
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
