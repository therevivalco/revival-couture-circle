import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

interface Product {
    id: number;
    name: string;
    brand: string;
    material: string;
    price: number;
    originalPrice: number;
    condition: string;
    category: string;
    size: string;
    product_type: string;
    image: string;
}

interface EditProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EditProductModal = ({ product, isOpen, onClose, onSuccess }: EditProductModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        material: "",
        price: "",
        originalPrice: "",
        condition: "",
        category: "",
        size: "",
        product_type: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const conditions = ["Excellent", "Like New", "Good", "Fair"];
    const categories = ["For Her", "For Him", "Kids", "Accessories"];
    const sizes = ["Free size", "XS", "S", "M", "L", "XL", "XXL"];
    const productTypes = [
        "T-Shirts", "Shirts", "Blouses", "Sweaters", "Hoodies",
        "Jeans", "Pants", "Shorts", "Skirts",
        "Dresses", "Jackets", "Coats",
        "Sneakers", "Boots", "Sandals", "Heels",
        "Bags", "Belts", "Hats", "Scarves", "Jewelry", "Watches",
        "Other"
    ];

    useEffect(() => {
        if (product && isOpen) {
            setFormData({
                name: product.name,
                brand: product.brand,
                material: product.material,
                price: product.price.toString(),
                originalPrice: product.originalPrice.toString(),
                condition: product.condition,
                category: product.category,
                size: product.size || "",
                product_type: product.product_type || "",
            });
            setImagePreview(product.image);
            setImageFile(null);
        }
    }, [product, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB");
                return;
            }

            if (!file.type.startsWith("image/")) {
                toast.error("Please upload an image file");
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB");
                return;
            }

            if (!file.type.startsWith("image/")) {
                toast.error("Please upload an image file");
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(product?.image || null);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!product) return;

        try {
            let imageUrl = product.image;

            // Upload new image if selected
            if (imageFile) {
                setIsUploading(true);
                const imageFormData = new FormData();
                imageFormData.append("image", imageFile);

                const uploadResponse = await apiFetch("/api/upload", {
                    method: "POST",
                    body: imageFormData,
                });

                if (!uploadResponse.ok) {
                    const error = await uploadResponse.json();
                    throw new Error(error.error || "Failed to upload image");
                }

                const uploadData = await uploadResponse.json();
                imageUrl = uploadData.imageUrl;
                setIsUploading(false);
            }

            setIsSubmitting(true);

            // Update product
            const response = await apiFetch(`/api/products/${product.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    originalPrice: parseFloat(formData.originalPrice),
                    image: imageUrl,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update product");
            }

            toast.success("Product updated successfully!");
            onSuccess();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsUploading(false);
            setIsSubmitting(false);
        }
    };

    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
                <DialogHeader className="sticky top-0 bg-background z-10 p-6 border-b flex-shrink-0">
                    <DialogTitle className="text-2xl font-serif">Edit Product</DialogTitle>
                </DialogHeader>
                <div
                    className="overflow-y-auto flex-1 p-6"
                    onWheel={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="image">Product Image</Label>
                            <AnimatePresence mode="wait">
                                {imagePreview ? (
                                    <motion.div
                                        key="preview"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative rounded-lg overflow-hidden border border-border"
                                    >
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-64 object-cover"
                                        />
                                        {imageFile && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 rounded-full"
                                                onClick={removeImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {!imageFile && (
                                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={() => document.getElementById("edit-image-input")?.click()}
                                                >
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Change Image
                                                </Button>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                                        onClick={() => document.getElementById("edit-image-input")?.click()}
                                    >
                                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Drag and drop your image here, or click to browse
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Maximum file size: 2MB
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <input
                                id="edit-image-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="brand">Brand *</Label>
                                <Input
                                    id="brand"
                                    value={formData.brand}
                                    onChange={(e) => handleInputChange("brand", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="material">Material *</Label>
                                <Input
                                    id="material"
                                    value={formData.material}
                                    onChange={(e) => handleInputChange("material", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="condition">Condition *</Label>
                                <Select
                                    value={formData.condition}
                                    onValueChange={(value) => handleInputChange("condition", value)}
                                >
                                    <SelectTrigger id="condition">
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {conditions.map((condition) => (
                                            <SelectItem key={condition} value={condition}>
                                                {condition}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => handleInputChange("category", value)}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="size">Size *</Label>
                                <Select
                                    value={formData.size}
                                    onValueChange={(value) => handleInputChange("size", value)}
                                >
                                    <SelectTrigger id="size">
                                        <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sizes.map((size) => (
                                            <SelectItem key={size} value={size}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product_type">Product Type *</Label>
                                <Select
                                    value={formData.product_type}
                                    onValueChange={(value) => handleInputChange("product_type", value)}
                                >
                                    <SelectTrigger id="product_type">
                                        <SelectValue placeholder="Select product type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {productTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Selling Price (₹) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange("price", e.target.value)}
                                    required
                                    min="0"
                                    step="1"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="originalPrice">Original Price (₹) *</Label>
                                <Input
                                    id="originalPrice"
                                    type="number"
                                    value={formData.originalPrice}
                                    onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                                    required
                                    min="0"
                                    step="1"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isUploading || isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isUploading || isSubmitting}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading Image...
                                    </>
                                ) : isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductModal;


