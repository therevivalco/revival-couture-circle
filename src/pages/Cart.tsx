
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { X } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <div>
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-serif font-bold mb-8">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.size}</p>
                      <p className="text-sm">₹{item.price}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <h2 className="text-xl font-serif font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>₹{subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Shipping</p>
                <p>₹{shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold text-lg mb-4">
                <p>Total</p>
                <p>₹{total.toFixed(2)}</p>
              </div>
              <Button className="w-full">Proceed to Checkout</Button>
              <Button variant="outline" className="w-full mt-2" onClick={clearCart}>Clear Cart</Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
