import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CreditCard, Smartphone, Building2, Wallet, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface SavedAddress {
    id: number;
    name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    is_default: boolean;
}

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [useNewAddress, setUseNewAddress] = useState(false);

    const [shippingDetails, setShippingDetails] = useState({
        name: "",
        email: user?.email || "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Fetch saved addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user?.email) return;

            try {
                const response = await apiFetch(`/api/addresses/user/${user.email}`);
                if (response.ok) {
                    const addresses = await response.json();
                    setSavedAddresses(addresses);

                    // Auto-select default address if available
                    const defaultAddress = addresses.find((addr: SavedAddress) => addr.is_default);
                    if (defaultAddress && !useNewAddress) {
                        setSelectedAddressId(defaultAddress.id);
                        loadAddressToForm(defaultAddress);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
            }
        };

        fetchAddresses();
    }, [user]);

    const loadAddressToForm = (address: SavedAddress) => {
        setShippingDetails({
            name: address.name,
            email: user?.email || "",
            phone: address.phone,
            addressLine1: address.address_line1,
            addressLine2: address.address_line2 || "",
            city: address.city,
            state: address.state,
            pincode: address.pincode,
        });
    };

    const handleAddressSelect = (addressId: number) => {
        setSelectedAddressId(addressId);
        setUseNewAddress(false);
        const address = savedAddresses.find(addr => addr.id === addressId);
        if (address) {
            loadAddressToForm(address);
        }
    };

    const handleUseNewAddress = () => {
        setUseNewAddress(true);
        setSelectedAddressId(null);
        setShippingDetails({
            name: "",
            email: user?.email || "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pincode: "",
        });
    };

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
    ];

    const paymentOptions = [
        { id: "cod", name: "Cash on Delivery", icon: Wallet, description: "Pay when you receive" },
        { id: "upi", name: "UPI (GPay/PhonePe/BHIM)", icon: Smartphone, description: "Pay via UPI apps" },
        { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
        { id: "netbanking", name: "Net Banking", icon: Building2, description: "All major banks" },
    ];

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleInputChange = (field: string, value: string) => {
        setShippingDetails(prev => ({ ...prev, [field]: value }));
    };

    const validateStep1 = () => {
        const { name, email, phone, addressLine1, city, state, pincode } = shippingDetails;
        if (!name || !email || !phone || !addressLine1 || !city || !state || !pincode) {
            toast.error("Please fill in all required fields");
            return false;
        }
        if (!/^\d{10}$/.test(phone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return false;
        }
        if (!/^\d{6}$/.test(pincode)) {
            toast.error("Please enter a valid 6-digit PIN code");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (currentStep === 1 && !validateStep1()) return;
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const simulatePayment = async () => {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (paymentMethod !== "cod") {
            // Simulate payment gateway response
            const success = Math.random() > 0.1; // 90% success rate
            if (!success) {
                throw new Error("Payment failed. Please try again.");
            }
            return `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
        }
        return null;
    };

    const handlePlaceOrder = async () => {
        if (!agreedToTerms) {
            toast.error("Please agree to terms and conditions");
            return;
        }

        setIsSubmitting(true);
        try {
            let transactionId = null;

            // Simulate payment for non-COD methods
            if (paymentMethod !== "cod") {
                toast.info("Processing payment...");
                transactionId = await simulatePayment();
                toast.success("Payment successful!");
            }

            // Create order
            const orderData = {
                user_email: user?.email,
                total_amount: totalAmount,
                shipping_name: shippingDetails.name,
                shipping_email: shippingDetails.email,
                shipping_phone: shippingDetails.phone,
                shipping_address_line1: shippingDetails.addressLine1,
                shipping_address_line2: shippingDetails.addressLine2,
                shipping_city: shippingDetails.city,
                shipping_state: shippingDetails.state,
                shipping_pincode: shippingDetails.pincode,
                shipping_country: "India",
                payment_method: paymentMethod,
                payment_status: paymentMethod === "cod" ? "pending" : "completed",
                transaction_id: transactionId,
                status: "confirmed",
                orderItems: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    brand: item.brand,
                    quantity: item.quantity,
                    price: item.price,
                })),
            };

            const response = await apiFetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
                console.error("Order creation failed:", errorData);
                throw new Error(errorData.error || "Failed to create order");
            }

            const order = await response.json();

            clearCart();
            toast.success("Order placed successfully!");
            navigate(`/order-success/${order.id}`);
        } catch (error) {
            console.error("Order placement error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to place order");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        navigate("/login");
        return null;
    }

    if (cart.length === 0) {
        navigate("/cart");
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 py-12 px-4 pt-24 md:pt-28">
                <div className="max-w-7xl mx-auto">
                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step ? "border-olive bg-olive text-white" : "border-gray-300 text-gray-300"
                                        }`}>
                                        {step}
                                    </div>
                                    {step < 3 && (
                                        <div className={`w-24 h-1 ${currentStep > step ? "bg-olive" : "bg-gray-300"}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 max-w-md mx-auto">
                            <span className="text-sm">Shipping</span>
                            <span className="text-sm">Payment</span>
                            <span className="text-sm">Review</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Step 1: Shipping Address */}
                            {currentStep === 1 && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-2xl font-serif font-semibold mb-6">Shipping Address</h2>

                                        {/* Saved Addresses */}
                                        {savedAddresses.length > 0 && !useNewAddress && (
                                            <div className="mb-6">
                                                <h3 className="font-medium mb-3">Select a saved address</h3>
                                                <div className="space-y-3 mb-4">
                                                    {savedAddresses.map((address) => (
                                                        <Card
                                                            key={address.id}
                                                            className={`cursor-pointer transition-all ${selectedAddressId === address.id
                                                                    ? "border-olive border-2 bg-olive/5"
                                                                    : "hover:border-olive/50"
                                                                }`}
                                                            onClick={() => handleAddressSelect(address.id)}
                                                        >
                                                            <CardContent className="p-4">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="flex-shrink-0 mt-1">
                                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === address.id
                                                                                ? "border-olive bg-olive"
                                                                                : "border-gray-300"
                                                                            }`}>
                                                                            {selectedAddressId === address.id && (
                                                                                <div className="w-2 h-2 bg-white rounded-full" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <p className="font-semibold">{address.name}</p>
                                                                            {address.is_default && (
                                                                                <span className="text-xs bg-olive/20 text-olive px-2 py-0.5 rounded">
                                                                                    Default
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-sm text-muted-foreground">{address.phone}</p>
                                                                        <p className="text-sm mt-1">{address.address_line1}</p>
                                                                        {address.address_line2 && (
                                                                            <p className="text-sm">{address.address_line2}</p>
                                                                        )}
                                                                        <p className="text-sm">
                                                                            {address.city}, {address.state} - {address.pincode}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    onClick={handleUseNewAddress}
                                                    className="w-full"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Use a different address
                                                </Button>
                                            </div>
                                        )}

                                        {/* New Address Form */}
                                        {(useNewAddress || savedAddresses.length === 0) && (
                                            <>
                                                {savedAddresses.length > 0 && (
                                                    <div className="mb-4">
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => setUseNewAddress(false)}
                                                            size="sm"
                                                        >
                                                            ← Back to saved addresses
                                                        </Button>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="md:col-span-2">
                                                        <Label htmlFor="name">Full Name *</Label>
                                                        <Input
                                                            id="name"
                                                            value={shippingDetails.name}
                                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                                            placeholder="John Doe"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="email">Email *</Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={shippingDetails.email}
                                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                                            placeholder="john@example.com"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="phone">Phone Number *</Label>
                                                        <Input
                                                            id="phone"
                                                            value={shippingDetails.phone}
                                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                                            placeholder="9876543210"
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Label htmlFor="addressLine1">Address Line 1 *</Label>
                                                        <Input
                                                            id="addressLine1"
                                                            value={shippingDetails.addressLine1}
                                                            onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                                                            placeholder="House No., Street Name"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Label htmlFor="addressLine2">Address Line 2</Label>
                                                        <Input
                                                            id="addressLine2"
                                                            value={shippingDetails.addressLine2}
                                                            onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                                                            placeholder="Landmark (Optional)"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="city">City *</Label>
                                                        <Input
                                                            id="city"
                                                            value={shippingDetails.city}
                                                            onChange={(e) => handleInputChange("city", e.target.value)}
                                                            placeholder="Mumbai"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="state">State *</Label>
                                                        <Select value={shippingDetails.state} onValueChange={(value) => handleInputChange("state", value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select state" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {indianStates.map((state) => (
                                                                    <SelectItem key={state} value={state}>{state}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="pincode">PIN Code *</Label>
                                                        <Input
                                                            id="pincode"
                                                            value={shippingDetails.pincode}
                                                            onChange={(e) => handleInputChange("pincode", e.target.value)}
                                                            placeholder="400001"
                                                            maxLength={6}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <Button onClick={handleNext} className="w-full mt-6">
                                            Continue to Payment
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Step 2: Payment Method */}
                            {currentStep === 2 && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-2xl font-serif font-semibold mb-6">Payment Method</h2>
                                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <div className="space-y-4">
                                                {paymentOptions.map((option) => {
                                                    const Icon = option.icon;
                                                    return (
                                                        <div key={option.id} className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-olive">
                                                            <RadioGroupItem value={option.id} id={option.id} />
                                                            <Label htmlFor={option.id} className="flex items-center flex-1 cursor-pointer">
                                                                <Icon className="h-6 w-6 mr-3 text-olive" />
                                                                <div>
                                                                    <p className="font-medium">{option.name}</p>
                                                                    <p className="text-sm text-muted-foreground">{option.description}</p>
                                                                </div>
                                                            </Label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </RadioGroup>
                                        <div className="flex gap-4 mt-6">
                                            <Button variant="outline" onClick={handleBack} className="flex-1">
                                                Back
                                            </Button>
                                            <Button onClick={handleNext} className="flex-1">
                                                Review Order
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Step 3: Review Order */}
                            {currentStep === 3 && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-2xl font-serif font-semibold mb-6">Review Your Order</h2>

                                        {/* Shipping Details */}
                                        <div className="mb-6">
                                            <h3 className="font-semibold mb-2">Shipping Address</h3>
                                            <div className="text-sm text-muted-foreground">
                                                <p>{shippingDetails.name}</p>
                                                <p>{shippingDetails.addressLine1}</p>
                                                {shippingDetails.addressLine2 && <p>{shippingDetails.addressLine2}</p>}
                                                <p>{shippingDetails.city}, {shippingDetails.state} - {shippingDetails.pincode}</p>
                                                <p>Phone: {shippingDetails.phone}</p>
                                            </div>
                                        </div>

                                        {/* Payment Method */}
                                        <div className="mb-6">
                                            <h3 className="font-semibold mb-2">Payment Method</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {paymentOptions.find(p => p.id === paymentMethod)?.name}
                                            </p>
                                        </div>

                                        {/* Terms */}
                                        <div className="flex items-start space-x-2 mb-6">
                                            <Checkbox
                                                id="terms"
                                                checked={agreedToTerms}
                                                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                            />
                                            <Label htmlFor="terms" className="text-sm cursor-pointer">
                                                I agree to the terms and conditions and privacy policy
                                            </Label>
                                        </div>

                                        <div className="flex gap-4">
                                            <Button variant="outline" onClick={handleBack} className="flex-1" disabled={isSubmitting}>
                                                Back
                                            </Button>
                                            <Button onClick={handlePlaceOrder} className="flex-1" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    `Place Order - ₹${totalAmount.toLocaleString('en-IN')}`
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-serif font-semibold mb-4">Order Summary</h3>
                                    <div className="space-y-4">
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex gap-3">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                                                    <p className="text-sm">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t mt-4 pt-4">
                                        <div className="flex justify-between mb-2">
                                            <span>Subtotal</span>
                                            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span>Shipping</span>
                                            <span className="text-green-600">FREE</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                                            <span>Total</span>
                                            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;
