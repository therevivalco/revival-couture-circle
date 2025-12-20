import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Calendar as CalendarIcon, MapPin, ShoppingBag, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RentalItem {
    id: number;
    name: string;
    brand: string;
    category: string;
    size: string;
    condition: string;
    description: string;
    image: string;
    rental_price_per_day: number;
    minimum_rental_days: number;
    maximum_rental_days: number | null;
    security_deposit: number;
    available_from: string;
    available_till: string;
    pickup_method: string;
    status: string;
    owner_email: string;
}

const Rent = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useLocation().search ? [new URLSearchParams(useLocation().search)] : [new URLSearchParams()];
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("browse");
    const [rentals, setRentals] = useState<RentalItem[]>([]);
    const [myRentals, setMyRentals] = useState<RentalItem[]>([]);
    const [myBookings, setMyBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selectedRental, setSelectedRental] = useState<RentalItem | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Booking state
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [availabilityResult, setAvailabilityResult] = useState<any>(null);

    // Edit rental state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRental, setEditingRental] = useState<RentalItem | null>(null);

    // Check for tab parameter in URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['browse', 'list', 'my-rentals', 'my-bookings'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    useEffect(() => {
        fetchRentals();
        if (user) {
            fetchMyRentals();
            fetchMyBookings();
        }
    }, [user]);

    const fetchRentals = async () => {
        try {
            const response = await apiFetch("/api/rentals");
            if (response.ok) {
                const data = await response.json();
                setRentals(data);
            }
        } catch (error) {
            console.error("Failed to fetch rentals:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMyRentals = async () => {
        if (!user?.email) return;
        try {
            const response = await apiFetch(`/api/rentals/owner/${user.email}`);
            if (response.ok) {
                const data = await response.json();
                setMyRentals(data);
            }
        } catch (error) {
            console.error("Failed to fetch my rentals:", error);
        }
    };

    const fetchMyBookings = async () => {
        if (!user?.email) return;
        try {
            const response = await apiFetch(`/api/rentals/bookings/user/${user.email}`);
            if (response.ok) {
                const data = await response.json();
                setMyBookings(data);
            }
        } catch (error) {
            console.error("Failed to fetch my bookings:", error);
        }
    };

    const handleRentalClick = (rental: RentalItem) => {
        setSelectedRental(rental);
        setIsBookingModalOpen(true);
        setStartDate(undefined);
        setEndDate(undefined);
        setAvailabilityResult(null);
    };

    // Prevent background scroll when modal is open
    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        if (isBookingModalOpen) {
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
    }, [isBookingModalOpen]);

    // Prevent background scroll when edit modal is open
    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        if (isEditModalOpen) {
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
    }, [isEditModalOpen]);

    // Reset availability check when dates change
    useEffect(() => {
        setAvailabilityResult(null);
    }, [startDate, endDate]);

    const checkAvailability = async () => {
        if (!startDate || !endDate || !selectedRental) {
            toast.error("Please select both start and end dates");
            return;
        }

        setIsCheckingAvailability(true);
        try {
            const response = await apiFetch(`/api/rentals/${selectedRental.id}/check-availability`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setAvailabilityResult(result);
                if (!result.available) {
                    toast.error(result.message || "Selected dates are not available");
                } else {
                    toast.success(result.message || "Available for selected dates");
                }
            }
        } catch (error) {
            toast.error("Failed to check availability");
        } finally {
            setIsCheckingAvailability(false);
        }
    };

    const calculatePrice = () => {
        if (!startDate || !endDate || !selectedRental) return null;

        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const rentalAmount = selectedRental.rental_price_per_day * days;
        const platformFee = Math.max(200, rentalAmount * 0.05); // 5% or min ₹200
        const totalPayable = rentalAmount + selectedRental.security_deposit + platformFee;

        return {
            days,
            rentalAmount,
            securityDeposit: selectedRental.security_deposit,
            platformFee,
            totalPayable,
        };
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error("Please log in to book");
            navigate("/login");
            return;
        }

        if (!availabilityResult?.available) {
            toast.error("Please check availability first");
            return;
        }

        const priceBreakdown = calculatePrice();
        if (!priceBreakdown || !selectedRental) return;

        try {
            const response = await apiFetch(`/api/rentals/${selectedRental.id}/book`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rental_item_id: selectedRental.id,
                    renter_email: user.email,
                    start_date: startDate?.toISOString(),
                    end_date: endDate?.toISOString(),
                    rental_days: priceBreakdown.days,
                    rental_amount: priceBreakdown.rentalAmount,
                    security_deposit: priceBreakdown.securityDeposit,
                    platform_fee: priceBreakdown.platformFee,
                    total_amount: priceBreakdown.totalPayable,
                    status: "confirmed",
                    payment_method: "cod",
                    payment_status: "pending",
                }),
            });

            if (response.ok) {
                toast.success("Booking confirmed!");
                setIsBookingModalOpen(false);
                fetchMyBookings();
                fetchRentals();
            } else {
                const error = await response.json();
                toast.error(error.error || "Booking failed");
            }
        } catch (error) {
            toast.error("Failed to create booking");
        }
    };

    const handleCancelBooking = async (bookingId: number) => {
        if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await apiFetch(`/api/rentals/bookings/${bookingId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "cancelled",
                }),
            });

            if (response.ok) {
                toast.success("Booking cancelled successfully");
                fetchMyBookings();
                fetchRentals();
            } else {
                const error = await response.json();
                toast.error(error.error || "Failed to cancel booking");
            }
        } catch (error) {
            toast.error("Failed to cancel booking");
        }
    };

    const handleEditRental = async (rental: RentalItem) => {
        // Check if rental has any active bookings
        try {
            const response = await apiFetch(`/api/rentals/${rental.id}/bookings`);
            if (response.ok) {
                const bookings = await response.json();
                const activeBookings = bookings.filter((b: any) =>
                    b.status === 'confirmed' || b.status === 'active'
                );

                if (activeBookings.length > 0) {
                    toast.error("Cannot edit listing with active bookings");
                    return;
                }

                setEditingRental(rental);
                setIsEditModalOpen(true);
            }
        } catch (error) {
            toast.error("Failed to check booking status");
        }
    };

    const filteredRentals = rentals.filter((rental) => {
        const matchesSearch =
            rental.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rental.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || rental.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const priceBreakdown = calculatePrice();

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDF9]">
            <Navigation />
            <main className="flex-1 py-12 px-4 pt-24 md:pt-28">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-serif font-bold mb-8">Rent Fashion</h1>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
                            <TabsTrigger value="browse">
                                <Search className="h-4 w-4 mr-2" />
                                Browse
                            </TabsTrigger>
                            <TabsTrigger value="list">
                                <Plus className="h-4 w-4 mr-2" />
                                List for Rent
                            </TabsTrigger>
                            <TabsTrigger value="my-rentals">
                                <Package className="h-4 w-4 mr-2" />
                                My Listings ({myRentals.length})
                            </TabsTrigger>
                            <TabsTrigger value="my-bookings">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                My Bookings ({myBookings.length})
                            </TabsTrigger>
                        </TabsList>

                        {/* Browse Rentals Tab */}
                        <TabsContent value="browse">
                            {/* Filters */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search by name or brand..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="Dresses">Dresses</SelectItem>
                                        <SelectItem value="Tops">Tops</SelectItem>
                                        <SelectItem value="Bottoms">Bottoms</SelectItem>
                                        <SelectItem value="Outerwear">Outerwear</SelectItem>
                                        <SelectItem value="Accessories">Accessories</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Rental Grid */}
                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            ) : filteredRentals.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                        <h2 className="text-xl font-semibold mb-2">No rentals available</h2>
                                        <p className="text-muted-foreground">Check back later for new items</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredRentals.map((rental) => (
                                        <Card
                                            key={rental.id}
                                            className="cursor-pointer hover:shadow-lg transition-shadow"
                                            onClick={() => handleRentalClick(rental)}
                                        >
                                            <CardContent className="p-0">
                                                <img
                                                    src={rental.image}
                                                    alt={rental.name}
                                                    className="w-full h-64 object-cover rounded-t-lg"
                                                />
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-lg mb-1">{rental.name}</h3>
                                                    <p className="text-sm text-muted-foreground mb-2">{rental.brand}</p>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-lg font-bold text-olive">
                                                            ₹{rental.rental_price_per_day}/day
                                                        </p>
                                                        <Badge variant="secondary">{rental.category}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                                        <MapPin className="h-4 w-4" />
                                                        {rental.pickup_method === "shipping" ? "Shipping" : "Pickup"}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* List for Rent Tab */}
                        <TabsContent value="list">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-serif font-semibold mb-6">List Item for Rent</h2>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);

                                        try {
                                            const response = await apiFetch("/api/rentals", {
                                                method: "POST",
                                                body: formData,
                                            });

                                            if (response.ok) {
                                                toast.success("Rental listing created!");
                                                fetchMyRentals();
                                                setActiveTab("my-rentals");
                                                e.currentTarget.reset();
                                            } else {
                                                toast.error("Failed to create listing");
                                            }
                                        } catch (error) {
                                            toast.error("Failed to create listing");
                                        }
                                    }}>
                                        <input type="hidden" name="owner_email" value={user?.email} />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Item Details */}
                                            <div className="md:col-span-2">
                                                <h3 className="font-semibold mb-4">Item Details</h3>
                                            </div>

                                            <div>
                                                <Label htmlFor="name">Item Name *</Label>
                                                <Input id="name" name="name" required placeholder="e.g., Designer Evening Gown" />
                                            </div>

                                            <div>
                                                <Label htmlFor="brand">Brand *</Label>
                                                <Input id="brand" name="brand" required placeholder="e.g., Gucci" />
                                            </div>

                                            <div>
                                                <Label htmlFor="category">Category *</Label>
                                                <Select name="category" required>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Dresses">Dresses</SelectItem>
                                                        <SelectItem value="Tops">Tops</SelectItem>
                                                        <SelectItem value="Bottoms">Bottoms</SelectItem>
                                                        <SelectItem value="Outerwear">Outerwear</SelectItem>
                                                        <SelectItem value="Accessories">Accessories</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="size">Size *</Label>
                                                <Input id="size" name="size" required placeholder="e.g., M, L, XL" />
                                            </div>

                                            <div>
                                                <Label htmlFor="condition">Condition *</Label>
                                                <Select name="condition" required>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select condition" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="New">New</SelectItem>
                                                        <SelectItem value="Like New">Like New</SelectItem>
                                                        <SelectItem value="Excellent">Excellent</SelectItem>
                                                        <SelectItem value="Good">Good</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="image">Image *</Label>
                                                <Input id="image" name="image" type="file" accept="image/*" required />
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Input id="description" name="description" placeholder="Additional details about the item" />
                                            </div>

                                            {/* Rental Pricing */}
                                            <div className="md:col-span-2 mt-4">
                                                <h3 className="font-semibold mb-4">Rental Pricing</h3>
                                            </div>

                                            <div>
                                                <Label htmlFor="rental_price_per_day">Price per Day (₹) *</Label>
                                                <Input
                                                    id="rental_price_per_day"
                                                    name="rental_price_per_day"
                                                    type="number"
                                                    required
                                                    min="1"
                                                    placeholder="1200"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="security_deposit">Security Deposit (₹) *</Label>
                                                <Input
                                                    id="security_deposit"
                                                    name="security_deposit"
                                                    type="number"
                                                    required
                                                    min="0"
                                                    placeholder="2000"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="minimum_rental_days">Minimum Rental Days *</Label>
                                                <Input
                                                    id="minimum_rental_days"
                                                    name="minimum_rental_days"
                                                    type="number"
                                                    required
                                                    min="1"
                                                    defaultValue="3"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="maximum_rental_days">Maximum Rental Days</Label>
                                                <Input
                                                    id="maximum_rental_days"
                                                    name="maximum_rental_days"
                                                    type="number"
                                                    min="1"
                                                    placeholder="Optional"
                                                />
                                            </div>

                                            {/* Availability */}
                                            <div className="md:col-span-2 mt-4">
                                                <h3 className="font-semibold mb-4">Availability</h3>
                                            </div>

                                            <div>
                                                <Label htmlFor="available_from">Available From *</Label>
                                                <Input
                                                    id="available_from"
                                                    name="available_from"
                                                    type="date"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="available_till">Available Till *</Label>
                                                <Input
                                                    id="available_till"
                                                    name="available_till"
                                                    type="date"
                                                    required
                                                />
                                            </div>

                                            {/* Pickup Method */}
                                            <div className="md:col-span-2 mt-4">
                                                <h3 className="font-semibold mb-4">Delivery Method</h3>
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label>Pickup Method *</Label>
                                                <Select name="pickup_method" required defaultValue="shipping">
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="shipping">Shipping</SelectItem>
                                                        <SelectItem value="pickup">Pickup Only</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Terms */}
                                            <div className="md:col-span-2 mt-4">
                                                <div className="flex items-start space-x-2">
                                                    <Checkbox id="cleaning_fee_included" name="cleaning_fee_included" value="true" defaultChecked />
                                                    <Label htmlFor="cleaning_fee_included" className="text-sm cursor-pointer">
                                                        Cleaning fee included in rental price
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full mt-6">
                                            Create Rental Listing
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* My Rentals Tab */}
                        <TabsContent value="my-rentals">
                            {myRentals.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                        <h2 className="text-xl font-semibold mb-2">No rental listings yet</h2>
                                        <p className="text-muted-foreground mb-4">Start listing items for rent</p>
                                        <Button onClick={() => setActiveTab("list")}>Create Listing</Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {myRentals.map((rental) => (
                                        <Card key={rental.id}>
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <img
                                                        src={rental.image}
                                                        alt={rental.name}
                                                        className="w-full md:w-32 h-32 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h3 className="font-semibold text-lg">{rental.name}</h3>
                                                                <p className="text-sm text-muted-foreground">{rental.brand}</p>
                                                            </div>
                                                            <Badge className={
                                                                rental.status === 'available' ? 'bg-green-100 text-green-800' :
                                                                    rental.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                            }>
                                                                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                                                            </Badge>
                                                        </div>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Price/Day</p>
                                                                <p className="font-semibold">₹{rental.rental_price_per_day.toLocaleString('en-IN')}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Security Deposit</p>
                                                                <p className="font-semibold">₹{rental.security_deposit.toLocaleString('en-IN')}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Min Days</p>
                                                                <p className="font-semibold">{rental.minimum_rental_days}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Available Till</p>
                                                                <p className="font-semibold text-sm">
                                                                    {new Date(rental.available_till).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEditRental(rental)}
                                                                className="w-full md:w-auto"
                                                            >
                                                                Edit Listing
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* My Bookings Tab */}
                        <TabsContent value="my-bookings">
                            {myBookings.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                        <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
                                        <p className="text-muted-foreground mb-4">Browse rentals and make your first booking</p>
                                        <Button onClick={() => setActiveTab("browse")}>Browse Rentals</Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {myBookings.map((booking) => (
                                        <Card key={booking.id}>
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <img
                                                        src={booking.rental_items?.image}
                                                        alt={booking.rental_items?.name}
                                                        className="w-full md:w-32 h-32 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h3 className="font-semibold text-lg">{booking.rental_items?.name}</h3>
                                                                <p className="text-sm text-muted-foreground">{booking.rental_items?.brand}</p>
                                                            </div>
                                                            <Badge className={
                                                                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                                    booking.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                        booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                                'bg-yellow-100 text-yellow-800'
                                                            }>
                                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                            </Badge>
                                                        </div>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Start Date</p>
                                                                <p className="font-semibold text-sm">
                                                                    {new Date(booking.start_date).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">End Date</p>
                                                                <p className="font-semibold text-sm">
                                                                    {new Date(booking.end_date).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Rental Days</p>
                                                                <p className="font-semibold">{booking.rental_days}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Total Amount</p>
                                                                <p className="font-semibold">₹{booking.total_amount.toLocaleString('en-IN')}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 p-3 bg-muted rounded-lg">
                                                            <p className="text-sm">
                                                                <span className="font-medium">Security Deposit:</span> ₹{booking.security_deposit.toLocaleString('en-IN')}
                                                                {booking.deposit_refunded ?
                                                                    <span className="text-green-600 ml-2">(Refunded)</span> :
                                                                    <span className="text-muted-foreground ml-2">(Will be refunded after return)</span>
                                                                }
                                                            </p>
                                                        </div>
                                                        {booking.status === 'confirmed' && (
                                                            <div className="mt-4">
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => handleCancelBooking(booking.id)}
                                                                    className="w-full md:w-auto"
                                                                >
                                                                    Cancel Booking
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Booking Modal */}
            <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
                <DialogContent
                    className="max-w-2xl p-6 max-h-[85vh] overflow-hidden"
                    onWheelCapture={(e) => e.stopPropagation()}
                    onTouchMoveCapture={(e) => e.stopPropagation()}
                >
                    {selectedRental && (
                        <div className="flex flex-col h-full">
                            <DialogHeader className="flex-shrink-0 mb-4">
                                <DialogTitle>{selectedRental.name}</DialogTitle>
                            </DialogHeader>
                            <div className="overflow-y-auto flex-1 -mx-6 px-6 overscroll-contain" style={{ maxHeight: 'calc(85vh - 80px)' }}>
                                <div className="space-y-6 pb-4">
                                    <img
                                        src={selectedRental.image}
                                        alt={selectedRental.name}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />

                                    <div>
                                        <h3 className="font-semibold mb-2">Details</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <p><span className="text-muted-foreground">Brand:</span> {selectedRental.brand}</p>
                                            <p><span className="text-muted-foreground">Size:</span> {selectedRental.size}</p>
                                            <p><span className="text-muted-foreground">Condition:</span> {selectedRental.condition}</p>
                                            <p><span className="text-muted-foreground">Category:</span> {selectedRental.category}</p>
                                        </div>
                                        {selectedRental.description && (
                                            <p className="mt-2 text-sm">{selectedRental.description}</p>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Select Rental Period</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Start Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="w-full justify-start">
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={startDate}
                                                            onSelect={setStartDate}
                                                            disabled={(date) => date < new Date()}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <div>
                                                <Label>End Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="w-full justify-start">
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {endDate ? format(endDate, "PPP") : "Pick a date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={endDate}
                                                            onSelect={setEndDate}
                                                            disabled={(date) => !startDate || date <= startDate}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={checkAvailability}
                                            disabled={!startDate || !endDate || isCheckingAvailability}
                                            className="w-full mt-4"
                                            variant="outline"
                                        >
                                            {isCheckingAvailability ? (
                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</>
                                            ) : (
                                                "Check Availability"
                                            )}
                                        </Button>
                                        {availabilityResult && (
                                            <p className={cn(
                                                "text-sm mt-2",
                                                availabilityResult.available ? "text-green-600" : "text-red-600"
                                            )}>
                                                {availabilityResult.available ? "✓ " : "✗ "}
                                                {availabilityResult.message || (availabilityResult.available ? "Available" : "Not Available")}
                                            </p>
                                        )}
                                    </div>

                                    {priceBreakdown && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Price Breakdown</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>₹{selectedRental.rental_price_per_day} × {priceBreakdown.days} days</span>
                                                    <span>₹{priceBreakdown.rentalAmount.toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Security Deposit (refundable)</span>
                                                    <span>₹{priceBreakdown.securityDeposit.toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Platform Fee</span>
                                                    <span>₹{priceBreakdown.platformFee.toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                                    <span>Total Payable</span>
                                                    <span>₹{priceBreakdown.totalPayable.toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleBooking}
                                        disabled={!availabilityResult?.available}
                                        className="w-full"
                                    >
                                        Confirm Booking
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Rental Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent
                    className="max-w-4xl max-h-[85vh] overflow-hidden p-6"
                    onWheelCapture={(e) => e.stopPropagation()}
                    onTouchMoveCapture={(e) => e.stopPropagation()}
                >
                    {editingRental && (
                        <div className="flex flex-col max-h-[calc(85vh-3rem)]">
                            <DialogHeader className="flex-shrink-0 mb-4">
                                <DialogTitle>Edit Rental Listing</DialogTitle>
                            </DialogHeader>
                            <div className="overflow-y-auto flex-1 -mx-6 px-6 overscroll-contain" style={{ maxHeight: 'calc(85vh - 120px)' }}>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);

                                    try {
                                        const response = await apiFetch(`/api/rentals/${editingRental.id}`, {
                                            method: "PUT",
                                            body: formData,
                                        });

                                        if (response.ok) {
                                            toast.success("Rental listing updated!");
                                            fetchMyRentals();
                                            setIsEditModalOpen(false);
                                            setEditingRental(null);
                                        } else {
                                            toast.error("Failed to update listing");
                                        }
                                    } catch (error) {
                                        toast.error("Failed to update listing");
                                    }
                                }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <h3 className="font-semibold mb-4">Item Details</h3>
                                        </div>

                                        <div>
                                            <Label htmlFor="edit_name">Item Name *</Label>
                                            <Input id="edit_name" name="name" required defaultValue={editingRental.name} />
                                        </div>

                                        <div>
                                            <Label htmlFor="edit_brand">Brand *</Label>
                                            <Input id="edit_brand" name="brand" required defaultValue={editingRental.brand} />
                                        </div>

                                        <div>
                                            <Label htmlFor="edit_category">Category *</Label>
                                            <Select name="category" required defaultValue={editingRental.category}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Dresses">Dresses</SelectItem>
                                                    <SelectItem value="Tops">Tops</SelectItem>
                                                    <SelectItem value="Bottoms">Bottoms</SelectItem>
                                                    <SelectItem value="Outerwear">Outerwear</SelectItem>
                                                    <SelectItem value="Accessories">Accessories</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="edit_size">Size *</Label>
                                            <Input id="edit_size" name="size" required defaultValue={editingRental.size} />
                                        </div>

                                        <div>
                                            <Label htmlFor="edit_condition">Condition *</Label>
                                            <Select name="condition" required defaultValue={editingRental.condition}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="New">New</SelectItem>
                                                    <SelectItem value="Like New">Like New</SelectItem>
                                                    <SelectItem value="Excellent">Excellent</SelectItem>
                                                    <SelectItem value="Good">Good</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="edit_image">Image (leave empty to keep current)</Label>
                                            <Input id="edit_image" name="image" type="file" accept="image/*" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <Label htmlFor="edit_description">Description</Label>
                                            <Input id="edit_description" name="description" defaultValue={editingRental.description || ""} />
                                        </div>

                                        <div className="md:col-span-2 mt-4">
                                            <h3 className="font-semibold mb-4">Rental Pricing</h3>
                                        </div>

                                        <div>
                                            <Label htmlFor="edit_rental_price_per_day">Price per Day (₹) *</Label>
                                            <Input id="edit_rental_price_per_day" name="rental_price_per_day" type="number" required min="1" defaultValue={editingRental.rental_price_per_day} />
                                        </div>

                                        <div>
                                            <Label htmlFor="edit_security_deposit">Security Deposit (₹) *</Label>
                                            <Input id="edit_security_deposit" name="security_deposit" type="number" required min="0" defaultValue={editingRental.security_deposit} />
                                        </div>

                                        <div>
                                            <Label htmlFor="edit_minimum_rental_days">Minimum Rental Days *</Label>
                                            <Input id="edit_minimum_rental_days" name="minimum_rental_days" type="number" required min="1" defaultValue={editingRental.minimum_rental_days} />
                                        </div>

                                        <div>
                                            <Label htmlFor="edit_maximum_rental_days">Maximum Rental Days</Label>
                                            <Input id="edit_maximum_rental_days" name="maximum_rental_days" type="number" min="1" defaultValue={editingRental.maximum_rental_days || ""} />
                                        </div>

                                        <div className="md:col-span-2 mt-4">
                                            <h3 className="font-semibold mb-4">Availability</h3>
                                        </div>

                                        <div>
                                            <Label htmlFor="edit_available_from">Available From *</Label>
                                            <Input id="edit_available_from" name="available_from" type="date" required defaultValue={editingRental.available_from?.split('T')[0]} />
                                        </div>

                                        <div>
                                            <Label htmlFor="edit_available_till">Available Till *</Label>
                                            <Input id="edit_available_till" name="available_till" type="date" required defaultValue={editingRental.available_till?.split('T')[0]} />
                                        </div>

                                        <div className="md:col-span-2 mt-4">
                                            <h3 className="font-semibold mb-4">Delivery Method</h3>
                                        </div>

                                        <div className="md:col-span-2">
                                            <Label>Pickup Method *</Label>
                                            <Select name="pickup_method" required defaultValue={editingRental.pickup_method}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="shipping">Shipping</SelectItem>
                                                    <SelectItem value="pickup">Pickup Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <Button type="submit" className="flex-1">Update Listing</Button>
                                        <Button type="button" variant="outline" onClick={() => { setIsEditModalOpen(false); setEditingRental(null); }}>Cancel</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default Rent;
