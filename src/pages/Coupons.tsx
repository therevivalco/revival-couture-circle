import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Gift, Percent } from "lucide-react";

const Coupons = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Placeholder coupons - will be replaced with actual data later
    const placeholderCoupons = [
        {
            id: 1,
            code: "WELCOME10",
            discount: "10% OFF",
            description: "Welcome discount on your first purchase",
            expiresAt: "2024-12-31",
            minPurchase: 1000,
            isActive: true,
        },
        {
            id: 2,
            code: "DONATE5",
            discount: "5% OFF",
            description: "Thank you for donating! Enjoy this discount",
            expiresAt: "2024-06-30",
            minPurchase: 500,
            isActive: true,
        },
    ];

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        // You can add a toast notification here
        alert(`Coupon code "${code}" copied to clipboard!`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDF9]">
            <Navigation />
            <main className="flex-1 py-12 px-4 pt-24 md:pt-28">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-serif font-bold mb-2">My Coupons</h1>
                        <p className="text-muted-foreground">
                            View and manage your discount coupons
                        </p>
                    </div>

                    {placeholderCoupons.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Tag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                <h2 className="text-xl font-semibold mb-2">No coupons available</h2>
                                <p className="text-muted-foreground mb-4">
                                    Check back later for exclusive discounts and offers
                                </p>
                                <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {placeholderCoupons.map((coupon) => (
                                <Card
                                    key={coupon.id}
                                    className={`hover:shadow-lg transition-shadow ${!coupon.isActive ? "opacity-60" : ""
                                        }`}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Percent className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-xl">{coupon.discount}</h3>
                                                        {!coupon.isActive && (
                                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                                Expired
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {coupon.description}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span>Min. purchase: ₹{coupon.minPurchase}</span>
                                                        <span>•</span>
                                                        <span>Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                                <div className="bg-neutral-100 px-4 py-2 rounded-lg border-2 border-dashed border-neutral-300 text-center">
                                                    <p className="text-xs text-muted-foreground mb-1">Code</p>
                                                    <p className="font-mono font-bold text-lg">{coupon.code}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => copyToClipboard(coupon.code)}
                                                    disabled={!coupon.isActive}
                                                >
                                                    Copy Code
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Info Card */}
                    <Card className="mt-8 bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-900">
                                <Gift className="h-5 w-5" />
                                How to earn more coupons
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Donate clothes and receive a 10% discount coupon</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Subscribe to our newsletter for exclusive offers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Refer friends and earn rewards</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Coupons;
