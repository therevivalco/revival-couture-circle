import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface Address {
    id: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    is_default: boolean;
}

interface DonationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
}

export const DonationFormModal = ({ isOpen, onClose, userEmail }: DonationFormModalProps) => {
    const [step, setStep] = useState(1);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [couponCode, setCouponCode] = useState("");
    const [copied, setCopied] = useState(false);

    // Step 1 - Donation Details
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [stateOfClothes, setStateOfClothes] = useState("");
    const [ageOfItem, setAgeOfItem] = useState("");
    const [wearableCondition, setWearableCondition] = useState(false);
    const [notDamaged, setNotDamaged] = useState(false);

    // Step 2 - Address & Pickup
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
        address_type: "Home",
    });
    const [pickupDate, setPickupDate] = useState("");
    const [pickupType, setPickupType] = useState("");

    // Prevent background scroll when modal is open
    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        if (isOpen) {
            body.style.overflow = 'hidden';
            html.style.overflow = 'hidden';
            (html.style as any).overscrollBehavior = 'none';
        } else {
            body.style.overflow = '';
            html.style.overflow = '';
            (html.style as any).overscrollBehavior = '';
        }

        return () => {
            body.style.overflow = '';
            html.style.overflow = '';
            (html.style as any).overscrollBehavior = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && step === 2) {
            fetchAddresses();
        }
    }, [isOpen, step]);

    const fetchAddresses = async () => {
        try {
            const response = await apiFetch(`/api/addresses/user/${userEmail}`);
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
                const defaultAddr = data.find((addr: Address) => addr.is_default);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.id);
                }
            }
        } catch (error) {
            toast.error("Failed to load addresses");
        }
    };

    const handleNext = () => {
        if (step === 1) {
            if (!category || !quantity || !stateOfClothes || !ageOfItem) {
                toast.error("Please fill all required fields");
                return;
            }
            if (parseInt(quantity) < 3) {
                toast.error("Minimum quantity is 3 items");
                return;
            }
            if (!wearableCondition || !notDamaged) {
                toast.error("Please accept both disclaimers");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            // Validate address
            if (useNewAddress || addresses.length === 0) {
                // Validate new address form
                if (!newAddress.name || !newAddress.phone || !newAddress.address_line1 ||
                    !newAddress.city || !newAddress.state || !newAddress.pincode) {
                    toast.error("Please fill all required address fields");
                    return;
                }
                if (newAddress.phone.length !== 10) {
                    toast.error("Phone number must be 10 digits");
                    return;
                }
                if (newAddress.pincode.length !== 6) {
                    toast.error("Pincode must be 6 digits");
                    return;
                }
            } else {
                // Validate saved address selection
                if (!selectedAddressId) {
                    toast.error("Please select an address");
                    return;
                }
            }

            if (!pickupDate || !pickupType) {
                toast.error("Please fill all required fields");
                return;
            }
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await apiFetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_email: userEmail,
                    category,
                    quantity: parseInt(quantity),
                    state_of_clothes: stateOfClothes,
                    age_of_item: ageOfItem,
                    address_id: selectedAddressId,
                    pickup_date: pickupDate,
                    pickup_type: pickupType,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setCouponCode(data.coupon_code);
                setStep(3);
            } else {
                toast.error("Failed to create donation");
            }
        } catch (error) {
            toast.error("Failed to create donation");
        }
    };

    const handleCopyCoupon = () => {
        navigator.clipboard.writeText(couponCode);
        setCopied(true);
        toast.success("Coupon code copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setStep(1);
        setCategory("");
        setQuantity("");
        setStateOfClothes("");
        setAgeOfItem("");
        setWearableCondition(false);
        setNotDamaged(false);
        setSelectedAddressId(null);
        setPickupDate("");
        setPickupType("");
        setCouponCode("");
        onClose();
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                className="max-w-2xl max-h-[85vh] overflow-hidden p-6"
                onWheelCapture={(e) => e.stopPropagation()}
                onTouchMoveCapture={(e) => e.stopPropagation()}
            >
                <DialogHeader className="flex-shrink-0 mb-4">
                    <DialogTitle>
                        {step === 1 && "Donation Details"}
                        {step === 2 && "Pickup Information"}
                        {step === 3 && "Thank You!"}
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 -mx-6 px-6 overscroll-contain" style={{ maxHeight: 'calc(85vh - 120px)' }}>
                    {/* Step 1: Donation Details */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="category">Category *</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="clothes">Clothes</SelectItem>
                                        <SelectItem value="footwear">Footwear</SelectItem>
                                        <SelectItem value="accessories">Accessories</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="quantity">Quantity (minimum 3) *</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="3"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="Enter quantity"
                                />
                            </div>

                            <div>
                                <Label htmlFor="state">State of Clothes *</Label>
                                <Select value={stateOfClothes} onValueChange={setStateOfClothes}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="excellent">Excellent</SelectItem>
                                        <SelectItem value="good">Good</SelectItem>
                                        <SelectItem value="fair">Fair</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="age">Age of Item *</Label>
                                <Select value={ageOfItem} onValueChange={setAgeOfItem}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select age" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="less-than-1-year">Less than 1 year</SelectItem>
                                        <SelectItem value="1-2-years">1-2 years</SelectItem>
                                        <SelectItem value="2-5-years">2-5 years</SelectItem>
                                        <SelectItem value="more-than-5-years">More than 5 years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Card className="bg-yellow-50 border-yellow-200">
                                <CardContent className="p-4">
                                    <p className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Important Disclaimer</p>
                                    <p className="text-sm text-yellow-700">Innerwear items are NOT allowed for donation.</p>
                                </CardContent>
                            </Card>

                            <div className="space-y-3">
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="wearable"
                                        checked={wearableCondition}
                                        onCheckedChange={(checked) => setWearableCondition(checked as boolean)}
                                    />
                                    <label htmlFor="wearable" className="text-sm cursor-pointer">
                                        The clothes are in wearable condition *
                                    </label>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="notDamaged"
                                        checked={notDamaged}
                                        onCheckedChange={(checked) => setNotDamaged(checked as boolean)}
                                    />
                                    <label htmlFor="notDamaged" className="text-sm cursor-pointer">
                                        The clothes are not too torn, spoiled, poorly stained, faded, or have strong odours *
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Address & Pickup */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <Label>Select Address *</Label>
                                {!useNewAddress && addresses.length > 0 ? (
                                    <>
                                        <div className="space-y-2 mt-2">
                                            {addresses.map((addr) => (
                                                <Card
                                                    key={addr.id}
                                                    className={`cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : ''}`}
                                                    onClick={() => setSelectedAddressId(addr.id)}
                                                >
                                                    <CardContent className="p-4">
                                                        <p className="font-medium">{addr.address_line1}</p>
                                                        {addr.address_line2 && <p className="text-sm">{addr.address_line2}</p>}
                                                        <p className="text-sm text-muted-foreground">
                                                            {addr.city}, {addr.state} - {addr.postal_code}
                                                        </p>
                                                        {addr.is_default && (
                                                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded mt-1 inline-block">
                                                                Default
                                                            </span>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setUseNewAddress(true)}
                                            className="w-full mt-3"
                                        >
                                            Use a different address
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {addresses.length > 0 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setUseNewAddress(false)}
                                                size="sm"
                                                className="mb-3"
                                            >
                                                ← Back to saved addresses
                                            </Button>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name *</Label>
                                                <Input
                                                    id="name"
                                                    value={newAddress.name}
                                                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number *</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={newAddress.phone}
                                                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                    maxLength={10}
                                                    pattern="[0-9]{10}"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label htmlFor="address_line1">Address Line 1 *</Label>
                                                <Input
                                                    id="address_line1"
                                                    value={newAddress.address_line1}
                                                    onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                                                    placeholder="House No., Building Name"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label htmlFor="address_line2">Address Line 2</Label>
                                                <Input
                                                    id="address_line2"
                                                    value={newAddress.address_line2}
                                                    onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                                                    placeholder="Road Name, Area, Colony"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City *</Label>
                                                <Input
                                                    id="city"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state">State *</Label>
                                                <Select
                                                    value={newAddress.state}
                                                    onValueChange={(value) => setNewAddress({ ...newAddress, state: value })}
                                                >
                                                    <SelectTrigger id="state">
                                                        <SelectValue placeholder="Select state" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                                                        <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                                                        <SelectItem value="Assam">Assam</SelectItem>
                                                        <SelectItem value="Bihar">Bihar</SelectItem>
                                                        <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                                                        <SelectItem value="Goa">Goa</SelectItem>
                                                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                                                        <SelectItem value="Haryana">Haryana</SelectItem>
                                                        <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                                                        <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                                                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                                                        <SelectItem value="Kerala">Kerala</SelectItem>
                                                        <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                                                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                                        <SelectItem value="Manipur">Manipur</SelectItem>
                                                        <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                                                        <SelectItem value="Mizoram">Mizoram</SelectItem>
                                                        <SelectItem value="Nagaland">Nagaland</SelectItem>
                                                        <SelectItem value="Odisha">Odisha</SelectItem>
                                                        <SelectItem value="Punjab">Punjab</SelectItem>
                                                        <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                                                        <SelectItem value="Sikkim">Sikkim</SelectItem>
                                                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                                        <SelectItem value="Telangana">Telangana</SelectItem>
                                                        <SelectItem value="Tripura">Tripura</SelectItem>
                                                        <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                                                        <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                                                        <SelectItem value="West Bengal">West Bengal</SelectItem>
                                                        <SelectItem value="Delhi">Delhi</SelectItem>
                                                        <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
                                                        <SelectItem value="Ladakh">Ladakh</SelectItem>
                                                        <SelectItem value="Puducherry">Puducherry</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pincode">Pincode *</Label>
                                                <Input
                                                    id="pincode"
                                                    type="tel"
                                                    value={newAddress.pincode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                                    maxLength={6}
                                                    pattern="[0-9]{6}"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="address_type">Address Type *</Label>
                                                <Select
                                                    value={newAddress.address_type}
                                                    onValueChange={(value) => setNewAddress({ ...newAddress, address_type: value })}
                                                >
                                                    <SelectTrigger id="address_type">
                                                        <SelectValue placeholder="Select address type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Home">🏠 Home</SelectItem>
                                                        <SelectItem value="Work">💼 Work</SelectItem>
                                                        <SelectItem value="Other">📍 Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="pickupDate">Preferred Pickup Date *</Label>
                                <Input
                                    id="pickupDate"
                                    type="date"
                                    min={getTomorrowDate()}
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Pickup Type *</Label>
                                <Select value={pickupType} onValueChange={setPickupType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select pickup type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="home">Home Pickup</SelectItem>
                                        <SelectItem value="dropoff">Drop Off</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Thank You */}
                    {step === 3 && (
                        <div className="text-center space-y-6 py-8">
                            <div className="text-6xl">🎉</div>
                            <h3 className="text-2xl font-bold">Thank You for Your Donation!</h3>
                            <p className="text-muted-foreground">
                                Your donation has been scheduled and approved. You're making a real difference!
                            </p>

                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="p-6">
                                    <p className="font-semibold text-green-800 mb-2">Your 10% OFF Coupon Code</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <code className="text-2xl font-bold text-green-700 bg-white px-4 py-2 rounded">
                                            {couponCode}
                                        </code>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopyCoupon}
                                            className="flex items-center gap-2"
                                        >
                                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            {copied ? "Copied!" : "Copy"}
                                        </Button>
                                    </div>
                                    <p className="text-sm text-green-700 mt-2">Valid for 90 days</p>
                                </CardContent>
                            </Card>

                            <p className="text-sm text-muted-foreground">
                                You can view this coupon anytime in your Coupons section.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between mt-6 flex-shrink-0">
                    {step < 3 && (
                        <>
                            {step > 1 && (
                                <Button variant="outline" onClick={() => setStep(step - 1)}>
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                            )}
                            <Button onClick={handleNext} className="ml-auto">
                                {step === 2 ? "Submit" : "Next"}
                                {step < 2 && <ChevronRight className="h-4 w-4 ml-2" />}
                            </Button>
                        </>
                    )}
                    {step === 3 && (
                        <Button onClick={handleClose} className="w-full">
                            Close
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
