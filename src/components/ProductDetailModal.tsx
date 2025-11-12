import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Share2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext.tsx";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  condition: string;
  description?: string;
  material?: string;
  size?: string;
  color?: string;
  care?: string;
  seller?: string;
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!product) return null;

  const sizes = ["XS", "S", "M", "L", "XL"];
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addToCart(product, selectedSize);
      onClose(); 
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">
          {product.brand} - {product.name} product details
        </DialogDescription>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-y-auto max-h-[90vh]">
          {/* Left: Image Section */}
          <div className="relative bg-muted/20">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover min-h-[500px]"
            />
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-olive/90 backdrop-blur-sm">
              <span className="text-xs font-medium text-white">{product.condition}</span>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="p-8 lg:p-12 space-y-6 overflow-y-auto">
            {/* Brand & Title */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {product.brand}
              </p>
              <h2 className="text-3xl font-serif font-bold mb-4">{product.name}</h2>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <span className="text-3xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="text-lg text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="px-2 py-1 bg-rose/20 text-rose rounded text-sm font-semibold">
                {discount}% OFF
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Product Details</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || 
                  `A timeless ${product.name.toLowerCase()} from ${product.brand}, carefully curated for conscious fashion lovers. This pre-loved piece is authenticated and ready to be part of your sustainable wardrobe.`
                }
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Select Size</h3>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-lg border-2 transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Specifications */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Material</span>
                <span className="font-medium">{product.material || "Premium Fabric"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Color</span>
                <span className="font-medium">{product.color || "Natural"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Condition</span>
                <span className="font-medium">{product.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Verified by</span>
                <span className="font-medium">The Revival Co.</span>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Care Instructions</h3>
              <p className="text-sm text-muted-foreground">
                {product.care || "Dry clean only. Store in a cool, dry place. Handle with care to maintain quality."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button 
                size="lg" 
                className="flex-1 rounded-full"
                disabled={!selectedSize}
                onClick={handleAddToCart}
              >
                {selectedSize ? "Add to Bag" : "Select Size"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-current text-rose" : ""}`}
                />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Sustainability Badge */}
            <div className="bg-olive/10 rounded-lg p-4 mt-6">
              <p className="text-sm font-medium mb-1">🌱 Sustainable Choice</p>
              <p className="text-xs text-muted-foreground">
                By choosing pre-loved, you're saving approximately 2.5kg of CO₂ emissions and 2,700 liters of water.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
