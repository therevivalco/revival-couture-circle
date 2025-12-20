import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Gift, Percent, Copy, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

const Coupons = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loadingCoupons, setLoadingCoupons] = useState(true);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user) {
            fetchCoupons();
        }
    }, [user]);

    const fetchCoupons = async () => {
        if (!user?.email) return;
        try {
            const response = await apiFetch(`/api/coupons/user/${user.email}`);
            if (response.ok) {
                const data = await response.json();
                setCoupons(data);
            }
        } catch (error) {
            toast.error("Failed to load coupons");
        } finally {
            setLoadingCoupons(false);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success(`Coupon code "${code}" copied!`);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const isExpired = (validUntil: string) => {
        return new Date(validUntil) < new Date();
    };

    if (loading || loadingCoupons) {
        return <div>Loading...</div>;
    }

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

                    {coupons.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Tag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                <h2 className="text-xl font-semibold mb-2">No coupons available</h2>
                                <p className="text-muted-foreground mb-4">
                                    Donate clothes to earn your first 10% discount coupon!
                                </p>
                                <Button onClick={() => navigate("/donate")}>Donate Now</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {coupons.map((coupon) => {
                                const expired = isExpired(coupon.valid_until);
                                const used = coupon.used;
                                const isActive = !expired && !used;

                                return (
                                    <Card
                                        key={coupon.id}
                                        className={`hover:shadow-lg transition-shadow ${!isActive ? "opacity-60" : ""}`}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Percent className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-xl">{coupon.discount_percentage}% OFF</h3>
                                                            {used && (
                                                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                                    Used
                                                                </span>
                                                            )}
                                                            {expired && !used && (
                                                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                                    Expired
                                                                </span>
                                                            )}
                                                            {isActive && (
                                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                    Active
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            Thank you for donating! Enjoy this discount on your next purchase.
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                            <span>Valid until: {new Date(coupon.valid_until).toLocaleDateString()}</span>
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
                                                        disabled={!isActive}
                                                        className="flex items-center gap-2"
                                                    >
                                                        {copiedCode === coupon.code ? (
                                                            <>
                                                                <Check className="h-4 w-4" />
                                                                Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="h-4 w-4" />
                                                                Copy Code
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
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
