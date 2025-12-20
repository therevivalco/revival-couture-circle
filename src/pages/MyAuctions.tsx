import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Gavel, TrendingUp, Package } from "lucide-react";
import { apiFetch } from "@/lib/api";

const MyAuctions = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myListings, setMyListings] = useState<any[]>([]);
    const [myBids, setMyBids] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch auctions created by user
                const listingsResponse = await apiFetch(`/api/auctions/user/${user.email}`);
                if (listingsResponse.ok) {
                    const listings = await listingsResponse.json();
                    setMyListings(listings);
                }

                // Fetch auctions user has bid on
                const bidsResponse = await apiFetch(`/api/auctions/bids/user/${user.email}`);
                if (bidsResponse.ok) {
                    const bids = await bidsResponse.json();
                    setMyBids(bids);
                }
            } catch (error) {
                console.error("Failed to fetch auction data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800";
            case "ended": return "bg-gray-100 text-gray-800";
            case "sold": return "bg-blue-100 text-blue-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getBidStatusColor = (isWinning: boolean, hasEnded: boolean) => {
        if (hasEnded) {
            return isWinning ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
        }
        return isWinning ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800";
    };

    const getBidStatusText = (isWinning: boolean, hasEnded: boolean) => {
        if (hasEnded) {
            return isWinning ? "Won" : "Lost";
        }
        return isWinning ? "Winning" : "Outbid";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDF9]">
            <Navigation />
            <main className="flex-1 py-12 px-4 pt-24 md:pt-28">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-serif font-bold mb-8">My Auctions</h1>

                    <Tabs defaultValue="listings" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                            <TabsTrigger value="listings">
                                <Package className="h-4 w-4 mr-2" />
                                My Listings ({myListings.length})
                            </TabsTrigger>
                            <TabsTrigger value="bids">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                My Bids ({myBids.length})
                            </TabsTrigger>
                        </TabsList>

                        {/* My Listings Tab */}
                        <TabsContent value="listings">
                            {myListings.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Gavel className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                        <h2 className="text-xl font-semibold mb-2">No auction listings yet</h2>
                                        <p className="text-muted-foreground mb-4">Start listing items for auction</p>
                                        <Button onClick={() => navigate("/auction")}>Create Auction</Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {myListings.map((auction) => (
                                        <Card key={auction.id} className="hover:shadow-lg transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <img
                                                        src={auction.image}
                                                        alt={auction.name}
                                                        className="w-full md:w-32 h-32 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h3 className="font-semibold text-lg">{auction.name}</h3>
                                                                <p className="text-sm text-muted-foreground">{auction.brand}</p>
                                                            </div>
                                                            <Badge className={getStatusColor(auction.status)}>
                                                                {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                                                            </Badge>
                                                        </div>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Starting Bid</p>
                                                                <p className="font-semibold">₹{auction.minimum_bid?.toLocaleString('en-IN')}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Current Bid</p>
                                                                <p className="font-semibold">₹{auction.current_bid?.toLocaleString('en-IN')}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Total Bids</p>
                                                                <p className="font-semibold">{auction.bid_count || 0}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Ends At</p>
                                                                <p className="font-semibold text-sm">
                                                                    {auction.start_time && auction.duration ?
                                                                        new Date(new Date(auction.start_time).getTime() + auction.duration * 24 * 60 * 60 * 1000).toLocaleDateString()
                                                                        : 'N/A'
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* My Bids Tab */}
                        <TabsContent value="bids">
                            {myBids.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                        <h2 className="text-xl font-semibold mb-2">No bids placed yet</h2>
                                        <p className="text-muted-foreground mb-4">Browse auctions and place your first bid</p>
                                        <Button onClick={() => navigate("/auction")}>Browse Auctions</Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {myBids.map((bid) => (
                                        <Card key={bid.auction_id} className="hover:shadow-lg transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <img
                                                        src={bid.auction_image}
                                                        alt={bid.auction_title}
                                                        className="w-full md:w-32 h-32 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h3 className="font-semibold text-lg">{bid.auction_title}</h3>
                                                                <p className="text-sm text-muted-foreground">{bid.auction_brand}</p>
                                                            </div>
                                                            <Badge className={getBidStatusColor(bid.is_winning, bid.has_ended)}>
                                                                {getBidStatusText(bid.is_winning, bid.has_ended)}
                                                            </Badge>
                                                        </div>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Your Bid</p>
                                                                <p className="font-semibold">₹{bid.your_bid?.toLocaleString('en-IN')}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Current Bid</p>
                                                                <p className="font-semibold">₹{bid.current_bid?.toLocaleString('en-IN')}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Bid Time</p>
                                                                <p className="font-semibold text-sm">
                                                                    {new Date(bid.bid_time).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Auction Ends</p>
                                                                <p className="font-semibold text-sm">
                                                                    {new Date(bid.end_time).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {!bid.has_ended && !bid.is_winning && (
                                                            <Button
                                                                size="sm"
                                                                className="mt-4"
                                                                onClick={() => navigate("/auction")}
                                                            >
                                                                Place Higher Bid
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MyAuctions;
