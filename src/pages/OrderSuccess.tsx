import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Package, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

const OrderSuccess = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await apiFetch(`/api/orders/${orderId}`);
                const data = await response.json();
                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1 flex items-center justify-center">
                    <p>Order not found</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 py-12 px-4 pt-24 md:pt-28">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto mb-4" />
                        <h1 className="text-3xl font-serif font-bold mb-2">Order Placed Successfully!</h1>
                        <p className="text-muted-foreground">Thank you for your purchase</p>
                    </div>

                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-muted-foreground">Order Number</p>
                                    <p className="font-semibold">{order.order_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Order Date</p>
                                    <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="font-semibold">₹{order.total_amount.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Payment Method</p>
                                    <p className="font-semibold capitalize">{order.payment_method.replace('_', ' ')}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">Shipping Address</h3>
                                <div className="text-sm text-muted-foreground">
                                    <p>{order.shipping_name}</p>
                                    <p>{order.shipping_address_line1}</p>
                                    {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                                    <p>{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
                                    <p>Phone: {order.shipping_phone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4 flex items-center">
                                <Package className="h-5 w-5 mr-2" />
                                Order Items
                            </h3>
                            <div className="space-y-4">
                                {order.order_items?.map((item: any) => (
                                    <div key={item.id} className="flex gap-4">
                                        <img src={item.product_image} alt={item.product_name} className="w-20 h-20 object-cover rounded" />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.product_name}</p>
                                            <p className="text-sm text-muted-foreground">{item.product_brand}</p>
                                            <p className="text-sm">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button onClick={() => navigate("/orders")} variant="outline" className="flex-1">
                            View All Orders
                        </Button>
                        <Button onClick={() => navigate("/shop")} className="flex-1">
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderSuccess;
