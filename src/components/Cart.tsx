
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { X } from 'lucide-react';

const Cart = () => {
  const { cartItems, isCartOpen, removeFromCart, clearCart, toggleCart } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Shopping Cart</h2>
        <Button variant="ghost" size="icon" onClick={toggleCart}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.size}</p>
                <p className="text-sm">${item.price}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button className="w-full mt-4" onClick={clearCart}>Clear Cart</Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
