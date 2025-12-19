import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useWishlist } from "../context/WishlistContext";
import Navigation from "../components/Navigation";
import { useCart } from "../context/CartContext";
import ProductDetailModal from "../components/ProductDetailModal";
import { useState } from "react";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-28 pb-20">
        <div className="flex items-center justify-between mb-8">
          <Link to="/shop" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Shop</span>
          </Link>
          <h1 className="text-3xl font-serif font-semibold">My Wishlist</h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Heart className="h-20 w-20 text-muted-foreground/30 mb-6" />
            <h2 className="text-2xl font-serif font-semibold mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              Start adding products you love to your wishlist
            </p>
            <Link to="/shop">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {wishlistItems.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4 bg-muted cursor-pointer" onClick={() => handleProductClick(item)}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="h-5 w-5 fill-primary text-primary" />
                  </button>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{item.brand}</p>
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.material}</p>
                    <p className="font-semibold text-foreground">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleMoveToCart(item)}>
                    Move to Cart
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center pt-8 border-t border-border">
              <Link to="/shop">
                <Button size="lg" variant="outline" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Wishlist;
