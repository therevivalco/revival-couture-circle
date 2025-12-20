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
                        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setIsDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Address
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingAddress ? "Edit Address" : "Add New Address"}
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="address_line1">Address Line 1 *</Label>
                                        <Input
                                            id="address_line1"
                                            value={formData.address_line1}
                                            onChange={(e) => handleInputChange("address_line1", e.target.value)}
                                            placeholder="House No., Building Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="address_line2">Address Line 2</Label>
                                        <Input
                                            id="address_line2"
                                            value={formData.address_line2}
                                            onChange={(e) => handleInputChange("address_line2", e.target.value)}
                                            placeholder="Road Name, Area, Colony"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City *</Label>
                                            <Input
                                                id="city"
                                                value={formData.city}
                                                onChange={(e) => handleInputChange("city", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">State *</Label>
                                            <Input
                                                id="state"
                                                value={formData.state}
                                                onChange={(e) => handleInputChange("state", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="pincode">Pincode *</Label>
                                        <Input
                                            id="pincode"
                                            value={formData.pincode}
                                            onChange={(e) => handleInputChange("pincode", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_default"
                                            checked={formData.is_default}
                                            onChange={(e) => handleInputChange("is_default", e.target.checked)}
                                            className="rounded"
                                        />
                                        <Label htmlFor="is_default" className="cursor-pointer">
                                            Set as default address
                                        </Label>
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                        <Button type="submit" className="flex-1">
                                            {editingAddress ? "Update Address" : "Add Address"}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={handleDialogClose}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
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
