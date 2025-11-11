
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Search, Heart, Clock } from "lucide-react";

// Mock Data for Auction Items
const auctionItems = [
  {
    id: 1,
    name: "Signed 'Summer Tour' Jacket",
    celebrity: "Celebrity Name",
    image: "/src/assets/image1.png",
    currentBid: 10899.0,
    bids: 6,
    timeLeft: "12h 45m 30s",
    endsSoon: false,
  },
  {
    id: 2,
    name: "Vintage Leather Boots",
    celebrity: "Designer Collection",
    image: "/src/assets/clothes.jpg",
    currentBid: 7499.0,
    bids: 12,
    timeLeft: "2d 8h 15m",
    endsSoon: false,
  },
  {
    id: 3,
    name: "Rare 'Moonlight' Vinyl",
    celebrity: "Artist Name",
    image: "/src/assets/sustainability-image.jpg",
    currentBid: 13499.0,
    bids: 2,
    timeLeft: "0h 55m 10s",
    endsSoon: true,
  },
  {
    id: 4,
    name: "Hand-painted Denim Jacket",
    celebrity: "Local Artisan",
    image: "/src/assets/kid.jpg",
    currentBid: 11399.0,
    bids: 25,
    timeLeft: "5d 2h 30m",
    endsSoon: false,
  },
];

const AuctionItemCard = ({ item }) => (
  <Card className="group overflow-hidden rounded-lg shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
    <CardContent className="p-0">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
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
        <h3 className="font-semibold text-lg truncate">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {item.celebrity}
        </p>
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="font-bold text-xl text-olive">
              ₹{item.currentBid.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground ml-2">
              &#x2022; {item.bids} bids
            </span>
          </div>
          <div
            className={`flex items-center text-sm font-medium ${
              item.endsSoon ? "text-rose" : "text-muted-foreground"
            }`}
          >
            <Clock className="h-4 w-4 mr-1" />
            {item.timeLeft}
          </div>
        </div>
        <Button variant="outline" className="w-full">
          View & Bid
        </Button>
      </div>
    </CardContent>
  </Card>
);

const AuctionPage = () => {
  const [step, setStep] = useState(1);
  const progress = (step / 3) * 100;

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

        <Tabs defaultValue="bids" className="container mx-auto px-6">
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
                  placeholder="Search by item or celebrity..."
                  className="pl-10 rounded-full"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Select>
                  <SelectTrigger className="w-full md:w-[180px] rounded-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="jackets">Jackets</SelectItem>
                    <SelectItem value="memorabilia">Memorabilia</SelectItem>
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

            <h2 className="text-2xl font-serif font-semibold mb-6">
              {auctionItems.length} Auctions Live Now
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {auctionItems.map((item) => (
                <AuctionItemCard key={item.id} item={item} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="rounded-full">
                Load More
              </Button>
            </div>
          </TabsContent>

          {/* List an Item Tab */}
          <TabsContent value="list" className="mt-10 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800">
                  Donate a Treasure. Make an Impact.
                </h2>
                <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
                  List your authentic, pre-loved luxury items for auction. Our
                  team vets every submission to ensure quality and authenticity.
                </p>
              </div>

              <Card className="p-8 rounded-xl shadow-soft">
                <div className="mb-6">
                  <Progress value={progress} className="w-full h-2" />
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Step {step} of 3
                  </p>
                </div>

                {step === 1 && (
                  <div className="animate-fade-in space-y-6">
                    <h3 className="text-2xl font-serif font-semibold">
                      Step 1: Item Details
                    </h3>
                    {/* Form fields for step 1 */}
                    <Button onClick={() => setStep(2)} className="w-full md:w-auto">
                      Next: Auction Details
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-fade-in space-y-6">
                    <h3 className="text-2xl font-serif font-semibold">
                      Step 2: Auction Details
                    </h3>
                    {/* Form fields for step 2 */}
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-full md:w-auto"
                      >
                        Back
                      </Button>
                      <Button onClick={() => setStep(3)} className="w-full md:w-auto">
                        Next: Donor Information
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-fade-in space-y-6">
                    <h3 className="text-2xl font-serif font-semibold">
                      Step 3: Donor Information
                    </h3>
                    {/* Form fields for step 3 */}
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="w-full md:w-auto"
                      >
                        Back
                      </Button>
                      <Button className="w-full md:w-auto" disabled>
                        Submit Item for Review
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AuctionPage;
