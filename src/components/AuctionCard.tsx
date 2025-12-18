import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock } from "lucide-react";
import { calculateTimeRemaining, formatTimeRemaining, isAuctionEndingSoon } from "@/lib/auctionUtils";

interface AuctionCardProps {
    auction: {
        id: number;
        name: string;
        brand: string;
        image: string;
        current_bid: number;
        start_time: string;
        duration: number;
        status: string;
    };
    onViewClick: (auction: any) => void;
}

const AuctionCard = ({ auction, onViewClick }: AuctionCardProps) => {
    const [timeRemaining, setTimeRemaining] = useState(
        calculateTimeRemaining(auction.start_time, auction.duration)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining(auction.start_time, auction.duration));
        }, 1000);

        return () => clearInterval(interval);
    }, [auction.start_time, auction.duration]);

    const endingSoon = isAuctionEndingSoon(timeRemaining);
    const timeString = formatTimeRemaining(timeRemaining);

    return (
        <Card className="group overflow-hidden rounded-lg shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
            <CardContent className="p-0">
                <div className="relative">
                    <img
                        src={auction.image}
                        alt={auction.name}
                        className="w-full h-80 object-cover"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
                    >
                        <Heart className="h-5 w-5" />
                    </Button>
                </div>
                <div className="p-5">
                    <h3 className="font-semibold text-lg truncate">{auction.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{auction.brand}</p>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <span className="font-bold text-xl text-olive">
                                ₹{auction.current_bid.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div
                            className={`flex items-center text-sm font-medium ${endingSoon ? "text-rose" : "text-muted-foreground"
                                }`}
                        >
                            <Clock className="h-4 w-4 mr-1" />
                            {timeString}
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onViewClick(auction)}
                    >
                        View & Bid
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AuctionCard;
