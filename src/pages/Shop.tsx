
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import ProductDetailModal from "@/components/ProductDetailModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample product data
const products = [
  {
    id: 1,
    name: "Vintage Linen Blazer",
    brand: "Heritage Collection",
    price: 7099,
    originalPrice: 19599,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=600&fit=crop",
    condition: "Excellent",
    description: "A classic vintage linen blazer with a timeless silhouette. Perfect for both formal and casual occasions. Features structured shoulders and a flattering fit.",
    material: "100% Linen",
    color: "Beige",
    care: "Dry clean recommended. Iron on low heat if needed.",
    category: "Women",
    isNew: true,
  },
  {
    id: 2,
    name: "Silk Midi Dress",
    brand: "Atelier Studio",
    price: 9999,
    originalPrice: 30399,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop",
    condition: "Like New",
    description: "Elegant silk midi dress with a flowing silhouette. Features delicate draping and a comfortable fit. Perfect for evening events and special occasions.",
    material: "100% Silk",
    color: "Champagne",
    care: "Hand wash cold or dry clean. Do not bleach.",
    category: "Women",
    isTrending: true,
  },
  {
    id: 3,
    name: "Cashmere Turtleneck",
    brand: "Nordic Knits",
    price: 5439,
    originalPrice: 15599,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop",
    condition: "Very Good",
    description: "Luxuriously soft cashmere turtleneck sweater. Lightweight yet warm, perfect for layering or wearing alone. A wardrobe essential for cooler months.",
    material: "100% Cashmere",
    color: "Cream",
    care: "Hand wash in cold water with mild detergent. Lay flat to dry.",
    category: "Men",
  },
  {
    id: 4,
    name: "Leather Crossbody Bag",
    brand: "Artisan Leather Co.",
    price: 11599,
    originalPrice: 33999,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop",
    condition: "Excellent",
    description: "Handcrafted leather crossbody bag with adjustable strap. Features multiple compartments for organization. Develops beautiful patina over time.",
    material: "Full-grain Leather",
    color: "Cognac Brown",
    care: "Clean with leather conditioner. Avoid water exposure.",
    category: "Accessories",
    isNew: true,
  },
  {
    id: 5,
    name: "Wool Trench Coat",
    brand: "Classic Tailoring",
    price: 14799,
    originalPrice: 51999,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=600&fit=crop",
    condition: "Like New",
    description: "Statement wool trench coat with classic double-breasted design. Features a belted waist and sophisticated tailoring. A timeless investment piece.",
    material: "80% Wool, 20% Cashmere",
    color: "Camel",
    care: "Professional dry clean only. Store on padded hanger.",
    category: "Women",
  },
  {
    id: 6,
    name: "Cotton Shirt Dress",
    brand: "Minimalist Line",
    price: 5999,
    originalPrice: 16799,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop",
    condition: "Very Good",
    description: "Versatile cotton shirt dress with a relaxed fit. Features button-front closure and practical pockets. Can be dressed up or down effortlessly.",
    material: "100% Organic Cotton",
    color: "White",
    care: "Machine wash cold. Tumble dry low or hang dry.",
    category: "Men",
    isTrending: true,
  },
  {
    id: 7,
    name: "Leather Ankle Boots",
    brand: "Urban Walkers",
    price: 12599,
    originalPrice: 35999,
    image: "/src/assets/boots.jpg",
    condition: "Excellent",
    description: "Stylish leather ankle boots with a sturdy heel. Perfect for everyday wear.",
    material: "Full-grain Leather",
    color: "Black",
    care: "Wipe clean with a damp cloth. Use leather protector.",
    category: "Women",
  },
  {
    id: 8,
    name: "Denim Jacket",
    brand: "Re-Stitched",
    price: 4599,
    originalPrice: 12999,
    image: "/src/assets/denim-jacket.jpg.png",
    condition: "Good",
    description: "Classic denim jacket with a modern fit. A versatile wardrobe staple.",
    material: "98% Cotton, 2% Elastane",
    color: "Blue",
    care: "Machine wash cold. Tumble dry low.",
    category: "Kids",
    isNew: true,
  },
];

const MotionButton = motion(Button);
const MotionHeart = motion(Heart);

const ProductCard = ({ product, onProductClick }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <motion.div
      className="group cursor-pointer relative"
      onClick={() => onProductClick(product)}
      whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-muted/30">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        <MotionHeart
          className={`absolute top-4 right-4 h-6 w-6 cursor-pointer drop-shadow-sm`}
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          variants={{
            initial: { scale: 1, opacity: 0.7 },
            hover: { scale: 1.2, opacity: 1 },
            toggled: { scale: 1.1, fill: "#FF6B6B", color: "#FF6B6B", opacity: 1 },
          }}
          initial="initial"
          whileHover="hover"
          animate={isWishlisted ? "toggled" : "initial"}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        {(product.isNew || product.isTrending) && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-olive/90 backdrop-blur-sm">
            <span className="text-xs font-medium text-white">{product.isNew ? "New" : "Trending"}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <h3 className="text-lg font-serif font-semibold group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">₹{product.price.toLocaleString("en-IN")}</span>
          <span className="text-sm text-muted-foreground line-through">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const ProductCarousel = ({ category, products, onProductClick, onSeeAllClick }) => {
  const carouselRef = useRef(null);
  
  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif font-bold">{category}</h2>
        <Button variant="link" className="text-olive" onClick={() => onSeeAllClick(category)}>
          See All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="relative">
        <motion.div ref={carouselRef} className="flex gap-8 overflow-x-auto pb-4 -mb-4"
          drag="x"
          dragConstraints={{ left: -100 * products.length, right: 0 }}
        >
          {products.map((product) => (
            <div key={product.id} className="w-[280px] flex-shrink-0">
              <ProductCard product={product} onProductClick={onProductClick} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};


const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Items");
  const [sortBy, setSortBy] = useState("newest");

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const category = searchParams.get("category");
    setActiveFilter(category || "All Items");
  }, [searchParams]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleFilterClick = (filter) => {
    if (filter === "All Items") {
      setSearchParams({});
    } else {
      setSearchParams({ category: filter });
    }
  };

  const sortProducts = (products) => {
    switch (sortBy) {
      case "price-asc":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...products].sort((a, b) => b.price - a.price);
      case "condition":
        const conditionOrder = { "Like New": 0, "Excellent": 1, "Very Good": 2, "Good": 3 };
        return [...products].sort((a, b) => conditionOrder[a.condition] - conditionOrder[b.condition]);
      default: // newest
        return [...products].reverse();
    }
  };

  const displayedProducts = sortProducts(
    activeFilter === "All Items"
      ? products
      : products.filter(p => p.category === activeFilter)
  );
  
  const categories = ["Women", "Men", "Accessories", "Kids"];
  const carousels = categories.map(category => ({
    category: `${category}'s Collection`,
    products: products.filter(p => p.category === category)
  }));
  

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      <Navigation />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/src/assets/hero-image.jpg')",
            y: parallaxY,
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <motion.div
          className="relative z-10 text-center text-white p-6"
          style={{ opacity: textOpacity, y: textY }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-serif font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Shop the Revival
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Curated Pre-Loved Luxury
          </motion.p>
          <motion.div 
            className="mt-8 flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button variant="outline" className="text-white border-white" onClick={() => handleFilterClick("Women")}>Women</Button>
            <Button variant="outline" className="text-white border-white" onClick={() => handleFilterClick("Men")}>Men</Button>
            <Button variant="outline" className="text-white border-white" onClick={() => handleFilterClick("Accessories")}>Accessories</Button>
          </motion.div>
        </motion.div>
      </motion.section>
      
      <main className="pt-16 pb-16">
        <div className="container mx-auto px-6">
          {/* Filters and Sorter */}
          <div className="sticky top-16 bg-neutral-50/80 backdrop-blur-sm z-20 py-4 mb-12">
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-3">
                {["All Items", "Women", "Men", "Accessories", "Kids"].map(filter => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => handleFilterClick(filter)}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
              <Select onValueChange={setSortBy} defaultValue={sortBy}>
                <SelectTrigger className="w-[180px] rounded-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="condition">Condition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeFilter !== "All Items" ? (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))}
            </motion.div>
          ) : (
            <>
              {carousels.map(({ category, products }) => (
                <ProductCarousel
                  key={category}
                  category={category}
                  products={sortProducts(products)}
                  onProductClick={handleProductClick}
                  onSeeAllClick={() => handleFilterClick(category.replace("'s Collection", ""))}
                />
              ))}
            </>
          )}

        </div>

        {/* Storytelling Section */}
        <motion.section 
          className="mt-24 py-20 bg-olive text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-6 text-center">
            <motion.h2 
              className="text-4xl font-serif mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Reviving Luxury with Purpose
            </motion.h2>
            <motion.p 
              className="text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Every piece carries a story. We are committed to sustainability and conscious consumption, giving timeless fashion a new life.
            </motion.p>
          </div>
        </motion.section>

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
