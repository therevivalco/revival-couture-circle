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
import { Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { calculateTimeRemaining, formatTimeRemaining, isAuctionEndingSoon } from "@/lib/auctionUtils";

interface Bid {
    id: number;
    bidder_id: string;
    bid_amount: number;
    bid_time: string;
}

interface AuctionDetailModalProps {
    auction: any;
    isOpen: boolean;
    onClose: () => void;
    onBidPlaced?: () => void;
}

const AuctionDetailModal = ({ auction, isOpen, onClose, onBidPlaced }: AuctionDetailModalProps) => {
    const { user } = useAuth();
    const [bidAmount, setBidAmount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bids, setBids] = useState<Bid[]>([]);
    const [isLoadingBids, setIsLoadingBids] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        if (auction && isOpen) {
            setTimeRemaining(calculateTimeRemaining(auction.start_time, auction.duration));
            fetchBids();

            const interval = setInterval(() => {
                setTimeRemaining(calculateTimeRemaining(auction.start_time, auction.duration));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [auction, isOpen]);

    const fetchBids = async () => {
        if (!auction) return;

        setIsLoadingBids(true);
        try {
            const response = await fetch(`/api/auctions/${auction.id}/bids`);
            if (response.ok) {
                const data = await response.json();
                setBids(data);
            }
        } catch (error) {
            console.error("Failed to fetch bids:", error);
        } finally {
            setIsLoadingBids(false);
        }
    };

    const handlePlaceBid = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please log in to place a bid");
            return;
        }

        const amount = parseFloat(bidAmount);
        if (isNaN(amount) || amount <= auction.current_bid) {
            toast.error(`Bid must be higher than current bid of ₹${auction.current_bid.toLocaleString('en-IN')}`);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/auctions/${auction.id}/bid`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bidder_id: user.email,
                    bid_amount: amount,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to place bid");
            }

            toast.success("Bid placed successfully!");
            setBidAmount("");
            fetchBids();
            if (onBidPlaced) {
                onBidPlaced();
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to place bid");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!auction) return null;

    const endingSoon = isAuctionEndingSoon(timeRemaining);
    const timeString = formatTimeRemaining(timeRemaining);

    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
                <DialogHeader className="sticky top-0 bg-background z-10 p-6 border-b flex-shrink-0">
                    <DialogTitle className="text-2xl font-serif">{auction.name}</DialogTitle>
                </DialogHeader>
                <div
                    className="overflow-y-auto flex-1 p-6"
                    onWheel={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Image */}
                        <div>
                            <img
                                src={auction.image}
                                alt={auction.name}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Brand</h3>
                                <p className="text-lg">{auction.brand}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                                <p className="text-lg">{auction.category}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Size</h3>
                                <p className="text-lg">{auction.size}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Condition</h3>
                                <p className="text-lg">{auction.condition}</p>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Current Bid</h3>
                                <p className="text-3xl font-bold text-olive">
                                    ₹{auction.current_bid.toLocaleString('en-IN')}
                                </p>
                            </div>

                            <div>
                                <div className={`flex items-center text-lg font-medium ${endingSoon ? "text-rose" : "text-muted-foreground"}`}>
                                    <Clock className="h-5 w-5 mr-2" />
                                    {timeString}
                                </div>
                            </div>

                            {/* Place Bid Form */}
                            {timeRemaining > 0 && (
                                <form onSubmit={handlePlaceBid} className="space-y-4 border-t pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="bid_amount">Your Bid (₹)</Label>
                                        <Input
                                            id="bid_amount"
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            placeholder={`Minimum: ₹${(auction.current_bid + 1).toLocaleString('en-IN')}`}
                                            min={auction.current_bid + 1}
                                            step="1"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Placing Bid...
                                            </>
                                        ) : (
                                            "Place Bid"
                                        )}
                                    </Button>
                                </form>
                            )}

                            {timeRemaining === 0 && (
                                <div className="border-t pt-4">
                                    <p className="text-lg font-semibold text-rose">Auction Ended</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bid History */}
                    <div className="mt-8 border-t pt-6">
                        <h3 className="text-xl font-serif font-semibold mb-4">Bid History</h3>
                        {isLoadingBids ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : bids.length > 0 ? (
                            <div className="space-y-3">
                                {bids.map((bid) => (
                                    <div
                                        key={bid.id}
                                        className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {bid.bidder_id.split('@')[0]}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(bid.bid_time).toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="text-lg font-semibold text-olive">
                                            ₹{bid.bid_amount.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">
                                No bids yet. Be the first to bid!
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuctionDetailModal;
