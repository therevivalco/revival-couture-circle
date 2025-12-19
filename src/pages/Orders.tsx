import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package } from "lucide-react";
import { apiFetch } from "@/lib/api";

const Orders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.email) return;

            try {
                const response = await apiFetch(`/api/orders/user/${user.email}`);
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (!user) {
        navigate("/login");
        return null;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "bg-green-100 text-green-800";
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "shipped": return "bg-blue-100 text-blue-800";
            case "delivered": return "bg-purple-100 text-purple-800";
            case "cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 py-12 px-4 pt-24 md:pt-28">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : orders.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                                <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                                <Button onClick={() => navigate("/shop")}>Browse Products</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                            <div>
                                                <p className="font-semibold text-lg">{order.order_number}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Placed on {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 md:mt-0">
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Badge>
                                                <p className="font-bold text-lg">₹{order.total_amount.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            {order.order_items?.slice(0, 2).map((item: any) => (
                                                <div key={item.id} className="flex gap-3">
                                                    <img src={item.product_image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                                                    <div>
                                                        <p className="font-medium text-sm">{item.product_name}</p>
                                                        <p className="text-xs text-muted-foreground">{item.product_brand}</p>
                                                        <p className="text-xs">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.order_items?.length > 2 && (
                                                <p className="text-sm text-muted-foreground">
                                                    +{order.order_items.length - 2} more items
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => navigate(`/order-success/${order.id}`)}>
                                                View Details
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => navigate("/shop")}>
                                                Buy Again
                                            </Button>
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

export default Orders;
