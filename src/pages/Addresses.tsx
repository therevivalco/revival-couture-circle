import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus, Edit, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface Address {
    id: number;
    name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    address_type: string;
    is_default: boolean;
}

const Addresses = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
        address_type: "Home",
        is_default: false,
    });

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
            return;
        }

        if (user) {
            fetchAddresses();
        }
    }, [user, loading, navigate]);

    // Reset form when dialog closes
    useEffect(() => {
        if (!isDialogOpen) {
            resetForm();
        }
    }, [isDialogOpen]);

    const fetchAddresses = async () => {
        try {
            const response = await apiFetch(`/api/addresses/user/${user?.email}`);
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.phone || !formData.address_line1 || !formData.city || !formData.state || !formData.pincode) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const url = editingAddress
                ? `/api/addresses/${editingAddress.id}`
                : `/api/addresses`;

            const method = editingAddress ? "PUT" : "POST";

            const response = await apiFetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    user_email: user?.email,
                }),
            });

            if (response.ok) {
                toast.success(editingAddress ? "Address updated successfully" : "Address added successfully");
                setIsDialogOpen(false);
                resetForm();
                fetchAddresses();
            } else {
                toast.error("Failed to save address");
            }
        } catch (error) {
            console.error("Error saving address:", error);
            toast.error("An error occurred");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this address?")) return;

        try {
            const response = await apiFetch(`/api/addresses/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Address deleted successfully");
                fetchAddresses();
            } else {
                toast.error("Failed to delete address");
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            toast.error("An error occurred");
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            const response = await apiFetch(`/api/addresses/${id}/default`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_email: user?.email }),
            });

            if (response.ok) {
                toast.success("Default address updated");
                fetchAddresses();
            } else {
                toast.error("Failed to update default address");
            }
        } catch (error) {
            console.error("Error setting default address:", error);
            toast.error("An error occurred");
        }
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setFormData({
            name: address.name,
            phone: address.phone,
            address_line1: address.address_line1,
            address_line2: address.address_line2 || "",
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            address_type: address.address_type || "Home",
            is_default: address.is_default,
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            pincode: "",
            address_type: "Home",
            is_default: false,
        });
        setEditingAddress(null);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        resetForm();
    };

    if (loading || isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDF9]">
            <Navigation />
            <main className="flex-1 py-12 px-4 pt-24 md:pt-28">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-serif font-bold mb-2">My Addresses</h1>
                            <p className="text-muted-foreground">
                                Manage your saved shipping addresses
                            </p>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Address
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] p-0">
                                <div
                                    className="max-h-[90vh] overflow-y-auto px-6 pb-6"
                                    onWheel={(e) => e.stopPropagation()}
                                >
                                    <DialogHeader className="sticky top-0 bg-background z-10 pt-6 pb-4">
                                        <DialogTitle className="text-xl font-serif">
                                            {editingAddress ? "Edit Address" : "Add New Address"}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name *</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                                    className="border-gray-300 focus:border-primary"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number *</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                                    className="border-gray-300 focus:border-primary"
                                                    placeholder="+91 XXXXX XXXXX"
                                                    maxLength={10}
                                                    pattern="[0-9]{10}"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address_line1">Address Line 1 *</Label>
                                            <Input
                                                id="address_line1"
                                                value={formData.address_line1}
                                                onChange={(e) => handleInputChange("address_line1", e.target.value)}
                                                className="border-gray-300 focus:border-primary"
                                                placeholder="House No., Building Name"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address_line2">Address Line 2</Label>
                                            <Input
                                                id="address_line2"
                                                value={formData.address_line2}
                                                onChange={(e) => handleInputChange("address_line2", e.target.value)}
                                                className="border-gray-300 focus:border-primary"
                                                placeholder="Road Name, Area, Colony"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City *</Label>
                                                <Input
                                                    id="city"
                                                    value={formData.city}
                                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                                    className="border-gray-300 focus:border-primary"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state">State *</Label>
                                                <Select
                                                    value={formData.state}
                                                    onValueChange={(value) => handleInputChange("state", value)}
                                                >
                                                    <SelectTrigger id="state" className="border-gray-300 focus:border-primary">
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
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pincode">Pincode *</Label>
                                            <Input
                                                id="pincode"
                                                type="tel"
                                                value={formData.pincode}
                                                onChange={(e) => handleInputChange("pincode", e.target.value)}
                                                className="border-gray-300 focus:border-primary w-full sm:w-1/2"
                                                maxLength={6}
                                                pattern="[0-9]{6}"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address_type">Address Type *</Label>
                                            <Select
                                                value={formData.address_type}
                                                onValueChange={(value) => handleInputChange("address_type", value)}
                                            >
                                                <SelectTrigger id="address_type" className="border-gray-300 focus:border-primary w-full sm:w-1/2">
                                                    <SelectValue placeholder="Select address type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Home">🏠 Home</SelectItem>
                                                    <SelectItem value="Work">💼 Work</SelectItem>
                                                    <SelectItem value="Other">📍 Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center gap-3 py-2">
                                            <input
                                                type="checkbox"
                                                id="is_default"
                                                checked={formData.is_default}
                                                onChange={(e) => handleInputChange("is_default", e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                            />
                                            <Label htmlFor="is_default" className="cursor-pointer text-sm">
                                                Set as default address
                                            </Label>
                                        </div>
                                        <div className="flex flex-row gap-3 pt-4 border-t">
                                            <Button type="submit" className="flex-1">
                                                {editingAddress ? "Update Address" : "Add Address"}
                                            </Button>
                                            <Button type="button" variant="outline" onClick={handleDialogClose} className="px-6">
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {addresses.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                <h2 className="text-xl font-semibold mb-2">No addresses saved</h2>
                                <p className="text-muted-foreground mb-4">
                                    Add a shipping address to make checkout faster
                                </p>
                                <Button onClick={() => setIsDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Address
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <Card key={address.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold text-lg">{address.name}</h3>
                                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                        {address.address_type === 'Home' && '🏠'}
                                                        {address.address_type === 'Work' && '💼'}
                                                        {address.address_type === 'Other' && '📍'}
                                                        {' '}{address.address_type}
                                                    </span>
                                                    {address.is_default && (
                                                        <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-1">{address.phone}</p>
                                                <p className="text-sm">{address.address_line1}</p>
                                                {address.address_line2 && (
                                                    <p className="text-sm">{address.address_line2}</p>
                                                )}
                                                <p className="text-sm">
                                                    {address.city}, {address.state} - {address.pincode}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEdit(address)}
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(address.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Delete
                                                </Button>
                                                {!address.is_default && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleSetDefault(address.id)}
                                                    >
                                                        <Star className="h-4 w-4 mr-1" />
                                                        Set Default
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Addresses;
