import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import EditProductModal from "./EditProductModal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Product {
    id: number;
    name: string;
    brand: string;
    material: string;
    price: number;
    originalPrice: number;
    condition: string;
    category: string;
    image: string;
    seller_id: string;
}

const fetchUserProducts = async (sellerId: string) => {
    console.log('Fetching products for seller:', sellerId);
    const response = await fetch(`/api/products/user/${sellerId}`);
    console.log('Response status:', response.status);
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    console.log('Products received:', data);
    return data;
};

const MyProductsTab = () => {
    const { user } = useAuth();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data: products = [], isLoading, error, refetch } = useQuery({
        queryKey: ["userProducts", user?.email],
        queryFn: () => fetchUserProducts(user?.email || ""),
        enabled: !!user?.email,
    });

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/products/${productToDelete.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            toast.success("Product deleted successfully");
            setProductToDelete(null);
            refetch();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete product");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleProductUpdated = () => {
        refetch();
        setIsEditModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-rose">Failed to load your products. Please try again.</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-2">You haven't listed any products yet.</p>
                <p className="text-sm text-muted-foreground">
                    Click "List Your Items" above to start selling!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold">
                My Products ({products.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                            <div className="relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                            <div className="p-4 space-y-3">
                                <div>
                                    <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xl font-bold text-olive">
                                            ₹{product.price.toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-through">
                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <span className="text-xs bg-muted px-2 py-1 rounded">
                                        {product.condition}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleEdit(product)}
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => setProductToDelete(product)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Modal */}
            <EditProductModal
                product={selectedProduct}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handleProductUpdated}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default MyProductsTab;
