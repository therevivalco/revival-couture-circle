
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuctionForm from "@/components/AuctionForm";
import AuctionCard from "@/components/AuctionCard";
import AuctionDetailModal from "@/components/AuctionDetailModal";
import { apiFetch } from "@/lib/api";

// Fetch auctions from API
const fetchAuctions = async () => {
  const response = await apiFetch('/api/auctions');
  if (!response.ok) {
    throw new Error('Failed to fetch auctions');
  }
  return response.json();
};

const AuctionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("bids");

  const { data: auctions = [], isLoading, error, refetch } = useQuery({
    queryKey: ['auctions'],
    queryFn: fetchAuctions,
    refetchInterval: 5000, // Refetch every 5 seconds to update bids
  });

  const handleViewAuction = (auction: any) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const handleAuctionCreated = () => {
    setActiveTab("bids");
    refetch();
    toast.success("Switch to 'Current Bids' tab to see your auction!");
  };

  const handleBidPlaced = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <Navigation />

      <main className="pt-24 pb-16 transition-opacity duration-300">
        <header className="text-center container mx-auto px-6 py-12 md:py-20">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-800 mb-4">
            The Exclusive Auction.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Bid on rare items, signed apparel, and luxury goods.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="container mx-auto px-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-neutral-200/60 p-1.5 rounded-full">
            <TabsTrigger
              value="bids"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              Current Bids
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  toast.error("Please log in to list an item");
                  navigate("/login");
                }
              }}
            >
              List an Item
            </TabsTrigger>
          </TabsList>

          {/* Current Bids Tab */}
          <TabsContent value="bids" className="mt-10 animate-fade-in">
            <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by item or brand..."
                  className="pl-10 rounded-full"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Select>
                  <SelectTrigger className="w-full md:w-[180px] rounded-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for-her">For Her</SelectItem>
                    <SelectItem value="for-him">For Him</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full md:w-[180px] rounded-full">
                    <SelectValue placeholder="Time Remaining" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ending-soon">Ending Soon</SelectItem>
                    <SelectItem value="just-listed">Just Listed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" className="rounded-full">
                  Reset Filters
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading auctions...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-rose">Failed to load auctions. Please try again.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-serif font-semibold mb-6">
                  {auctions.length} Auctions Live Now
                </h2>

                {auctions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {auctions.map((auction: any) => (
                      <AuctionCard
                        key={auction.id}
                        auction={auction}
                        onViewClick={handleViewAuction}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No active auctions at the moment.</p>
                    <p className="text-sm text-muted-foreground mt-2">Be the first to list an item!</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* List an Item Tab */}
          <TabsContent value="list" className="mt-10 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800">
                  List Your Luxury Item for Auction
                </h2>
                <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
                  List your authentic, pre-loved luxury items for auction. Set your starting bid and watch the offers come in!
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-8 shadow-soft">
                <AuctionForm onSuccess={handleAuctionCreated} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Auction Detail Modal */}
      <AuctionDetailModal
        auction={selectedAuction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBidPlaced={handleBidPlaced}
      />

      <Footer />
    </div>
  );
};

export default AuctionPage;
