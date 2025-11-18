
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { X, ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 40;
  const total = subtotal + shipping;

  return (
    <div>
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/shop">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-serif font-bold">Your Cart</h1>
        </div>
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">Your cart is empty.</p>
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                      <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                      <p className="text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id, item.size || "")}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="bg-muted/30 p-8 rounded-lg">
              <h2 className="text-xl font-serif font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>₹{subtotal.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Shipping</p>
                <p>₹{shipping.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex justify-between font-bold text-lg mb-4">
                <p>Total</p>
                <p>₹{total.toLocaleString('en-IN')}</p>
              </div>
              <Button className="w-full" size="lg">Proceed to Checkout</Button>
              <Link to="/shop" className="block mt-2">
                <Button variant="outline" className="w-full">Continue Shopping</Button>
              </Link>
              <Button variant="ghost" className="w-full mt-2" onClick={clearCart}>Clear Cart</Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
