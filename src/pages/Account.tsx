import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
    Package,
    Store,
    Gavel,
    Tag,
    MapPin,
    Heart,
    LogOut,
    User,
    Calendar,
    Gift,
    ChevronRight
} from "lucide-react";

const Account = () => {
    const { user, signOut, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const navigationCards = [
        {
            title: "My Orders",
            description: "View your order history and track shipments",
            icon: Package,
            path: "/orders",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "My Sell Listings",
            description: "Manage items you've listed for sale",
            icon: Store,
            path: "/sell?tab=my-products",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "My Rental Listings",
            description: "Manage items you've listed for rent",
            icon: Calendar,
            path: "/rent?tab=my-rentals",
            color: "text-teal-600",
            bgColor: "bg-teal-50",
        },
        {
            title: "My Rental Bookings",
            description: "View items you've rented from others",
            icon: Package,
            path: "/rent?tab=my-bookings",
            color: "text-cyan-600",
            bgColor: "bg-cyan-50",
        },
        {
            title: "My Donations",
            description: "View your donation history and coupons",
            icon: Gift,
            path: "/donate?tab=my-donations",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            title: "My Auctions",
            description: "View your auction listings and bids",
            icon: Gavel,
            path: "/my-auctions",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Coupons",
            description: "View and manage your discount coupons",
            icon: Tag,
            path: "/coupons",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Addresses",
            description: "Manage your saved shipping addresses",
            icon: MapPin,
            path: "/addresses",
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            title: "Wishlist",
            description: "View your saved favorite items",
            icon: Heart,
            path: "/wishlist",
            color: "text-pink-600",
            bgColor: "bg-pink-50",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDF9]">
            <Navigation />
            <div className="flex-1 container mx-auto px-4 py-12 pt-24 md:pt-28">
                <div className="max-w-6xl mx-auto">
                    {/* User Info Section */}
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-100 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                                    <User className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-serif font-bold mb-1">My Account</h1>
                                    <p className="text-neutral-600">{user?.email}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => signOut()}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>

                    {/* Navigation List */}
                    <div>
                        <h2 className="text-2xl font-serif font-semibold mb-6">Quick Access</h2>
                        <Card>
                            <CardContent className="p-0">
                                <div className="divide-y divide-neutral-100">
                                    {navigationCards.map((card, index) => {
                                        const Icon = card.icon;
                                        return (
                                            <div
                                                key={card.path}
                                                className="flex items-center justify-between p-4 hover:bg-neutral-50 cursor-pointer transition-colors group"
                                                onClick={() => navigate(card.path)}
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center flex-shrink-0`}>
                                                        <Icon className={`h-6 w-6 ${card.color}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-base mb-0.5">{card.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{card.description}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Account;
