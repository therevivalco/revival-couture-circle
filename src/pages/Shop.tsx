
import { useState, useEffect, useRef, forwardRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
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
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import { apiFetch } from "@/lib/api";

// Fetch products from API
const fetchProducts = async () => {
  const response = await apiFetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to add items to your wishlist");
      navigate("/login");
      return;
    }
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleProducts, setVisibleProducts] = useState(6);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

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
    setCategoryFilter(category || "All");
  }, [searchParams]);

  // Lock body scroll when filter sidebar is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCategoryFilterClick = (filter) => {
    setVisibleProducts(6);
    setCategoryFilter(filter);
    if (filter === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: filter });
    }
    handleScrollTo(catalogRef);
  };

  const clearAllFilters = () => {
    setCategoryFilter("All");
    setSizeFilter("All");
    setTypeFilter("All");
    setVisibleProducts(6);
    setSearchParams({});
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

  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSize = sizeFilter === "All" || p.size === sizeFilter;
    const matchesType = typeFilter === "All" || p.product_type === typeFilter;
    return matchesCategory && matchesSize && matchesType;
  });
  const displayedProducts = sortProducts(filteredProducts);

  const activeFilterCount = [categoryFilter, sizeFilter, typeFilter].filter(f => f !== "All").length;

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
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
          <div className="sticky top-[60px] bg-[#FDFDF9]/80 backdrop-blur-sm z-20 py-4 mb-8 border-b">
            <div className="flex justify-between items-center gap-4">
              <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="rounded-full gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filters {activeFilterCount > 0 && <span className="px-2 py-0.5 bg-olive text-white text-xs rounded-full">{activeFilterCount}</span>}
              </Button>
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <Input placeholder="Search" className="rounded-full pl-9 h-9" />
                </div>
                <Select onValueChange={setSortBy} defaultValue={sortBy}>
                  <SelectTrigger className="w-40 rounded-full h-9"><SelectValue placeholder="Sort by" /></SelectTrigger>
                  <SelectContent><SelectItem value="newest">Newest</SelectItem><SelectItem value="price-asc">Price: Low–High</SelectItem><SelectItem value="price-desc">Price: High–Low</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isFilterOpen && (<><div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsFilterOpen(false)} /><div className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto" onWheel={(e) => e.stopPropagation()}><div className="p-6"><div className="flex justify-between items-center mb-6"><div className="flex items-center gap-2"><h2 className="text-xl font-semibold">Filters</h2>{activeFilterCount > 0 && <span className="px-2 py-0.5 bg-olive text-white text-xs rounded-full">{activeFilterCount}</span>}</div><Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></Button></div>{activeFilterCount > 0 && <Button variant="outline" onClick={clearAllFilters} className="w-full mb-6">Clear All Filters</Button>}<div className="mb-6"><h3 className="font-medium mb-3">Category</h3><div className="flex flex-col gap-2">{["All", "For Her", "For Him", "Kids", "Accessories"].map(filter => <Button key={filter} variant={categoryFilter === filter ? "default" : "ghost"} className={`justify-start ${categoryFilter === filter ? "bg-olive text-white hover:bg-olive/90" : ""}`} onClick={() => { handleCategoryFilterClick(filter); setIsFilterOpen(false); }}>{filter}</Button>)}</div></div><div className="mb-6"><h3 className="font-medium mb-3">Size</h3><div className="grid grid-cols-3 gap-2">{["All", "Free size", "XS", "S", "M", "L", "XL", "XXL"].map(size => <Button key={size} variant={sizeFilter === size ? "default" : "outline"} size="sm" className={sizeFilter === size ? "bg-olive text-white hover:bg-olive/90" : ""} onClick={() => { setSizeFilter(size); setVisibleProducts(6); }}>{size}</Button>)}</div></div><div className="mb-6"><h3 className="font-medium mb-3">Type</h3><div className="flex flex-col gap-2">{["All", "T-Shirts", "Shirts", "Dresses", "Jeans", "Pants", "Jackets", "Shoes", "Bags", "Other"].map(type => <Button key={type} variant={typeFilter === type ? "default" : "ghost"} className={`justify-start ${typeFilter === type ? "bg-olive text-white hover:bg-olive/90" : ""}`} onClick={() => { setTypeFilter(type); setVisibleProducts(6); }}>{type}</Button>)}</div></div><Button onClick={() => setIsFilterOpen(false)} className="w-full bg-olive hover:bg-olive/90">Apply Filters</Button></div></div></>)}

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



