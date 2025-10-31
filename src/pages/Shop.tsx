import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

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
  },
  {
    id: 2,
    name: "Silk Midi Dress",
    brand: "Atelier Studio",
    price: 9999,
    originalPrice: 30399,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop",
    condition: "Like New",
  },
  {
    id: 3,
    name: "Cashmere Turtleneck",
    brand: "Nordic Knits",
    price: 5439,
    originalPrice: 15599,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop",
    condition: "Very Good",
  },
  {
    id: 4,
    name: "Leather Crossbody Bag",
    brand: "Artisan Leather Co.",
    price: 11599,
    originalPrice: 33999,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop",
    condition: "Excellent",
  },
  {
    id: 5,
    name: "Wool Trench Coat",
    brand: "Classic Tailoring",
    price: 14799,
    originalPrice: 51999,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=600&fit=crop",
    condition: "Like New",
  },
  {
    id: 6,
    name: "Cotton Shirt Dress",
    brand: "Minimalist Line",
    price: 5999,
    originalPrice: 16799,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop",
    condition: "Very Good",
  },
];

const Shop = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <h1 className="text-5xl font-serif font-bold mb-4">Shop</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover our curated collection of pre-loved luxury fashion. Each piece is carefully selected, authenticated, and ready for its next chapter.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            <Button variant="outline" className="rounded-full">All Items</Button>
            <Button variant="outline" className="rounded-full">Women</Button>
            <Button variant="outline" className="rounded-full">Men</Button>
            <Button variant="outline" className="rounded-full">Accessories</Button>
            <Button variant="outline" className="rounded-full">New Arrivals</Button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer animate-fade-in"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-muted/30">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    className={`absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-300 ${
                      hoveredId === product.id ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-olive/90 backdrop-blur-sm">
                    <span className="text-xs font-medium text-white">{product.condition}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  <h3 className="text-lg font-serif font-semibold group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-16">
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Load More Items
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
