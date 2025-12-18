import { useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface SellFormProps {
    onSuccess?: () => void;
}

const SellForm = ({ onSuccess }: SellFormProps) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        material: "",
        price: "",
        originalPrice: "",
        condition: "",
        category: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const conditions = ["Excellent", "Like New", "Good", "Fair"];
    const categories = ["For Her", "For Him", "Kids", "Accessories"];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB");
                return;
            }

            // Check file type
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
            // Check file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB");
                return;
            }

            // Check file type
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
        setImagePreview(null);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        if (!imageFile) {
            toast.error("Please upload an image");
            return;
        }

        if (
            !formData.name ||
            !formData.brand ||
            !formData.material ||
            !formData.price ||
            !formData.originalPrice ||
            !formData.condition ||
            !formData.category
        ) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setIsUploading(true);

            // Upload image first
            const imageFormData = new FormData();
            imageFormData.append("image", imageFile);

            const uploadResponse = await fetch("/api/upload", {
                method: "POST",
                body: imageFormData,
            });

            if (!uploadResponse.ok) {
                const error = await uploadResponse.json();
                throw new Error(error.error || "Failed to upload image");
            }

            const { imageUrl } = await uploadResponse.json();
            setIsUploading(false);
            setIsSubmitting(true);

            // Create product
            const productResponse = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    image: imageUrl,
                    seller_id: user?.email || "anonymous",
                }),
            });

            if (!productResponse.ok) {
                const error = await productResponse.json();
                throw new Error(error.error || "Failed to create product");
            }

            toast.success("Product listed successfully! It will appear in the shop shortly.");

            // Reset form
            setFormData({
                name: "",
                brand: "",
                material: "",
                price: "",
                originalPrice: "",
                condition: "",
                category: "",
            });
            setImageFile(null);
            setImagePreview(null);

            // Call onSuccess callback to close modal
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsUploading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                    <Label htmlFor="image">Product Image *</Label>
                    <AnimatePresence mode="wait">
                        {!imagePreview ? (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                                onClick={() => document.getElementById("image-input")?.click()}
                            >
                                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mb-2">
                                    Drag and drop your image here, or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Maximum file size: 2MB (JPEG, PNG, GIF, WebP)
                                </p>
                                <input
                                    id="image-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </motion.div>
                        ) : (
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
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 rounded-full"
                                    onClick={removeImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="e.g., Cotton T-shirt"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="brand">Brand *</Label>
                        <Input
                            id="brand"
                            value={formData.brand}
                            onChange={(e) => handleInputChange("brand", e.target.value)}
                            placeholder="e.g., Zara"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="material">Material *</Label>
                        <Input
                            id="material"
                            value={formData.material}
                            onChange={(e) => handleInputChange("material", e.target.value)}
                            placeholder="e.g., 100% Cotton"
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
                        <Label htmlFor="originalPrice">Original Price (₹) *</Label>
                        <Input
                            id="originalPrice"
                            type="number"
                            value={formData.originalPrice}
                            onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                            placeholder="e.g., 5000"
                            required
                            min="0"
                            step="1"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="price">Selling Price (₹) *</Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => handleInputChange("price", e.target.value)}
                            placeholder="e.g., 2500"
                            required
                            min="0"
                            step="1"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full text-base"
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
                            Submitting...
                        </>
                    ) : (
                        "List Item"
                    )}
                </Button>
            </form>
        </div>
    );
};

export default SellForm;
