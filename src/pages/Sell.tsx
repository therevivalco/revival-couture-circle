import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SellForm from "@/components/SellForm";
import MyProductsTab from "@/components/MyProductsTab";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, CheckCircle, DollarSign, Package } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Sell = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please log in to sell items");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Give Your Clothes a Second Story
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Turn your wardrobe into opportunity. List your pre-loved luxury items and join our community of conscious sellers.
            </p>
            <Button
              size="lg"
              className="text-base px-10 py-6 rounded-full"
              onClick={handleOpenForm}
            >
              List Your Items
            </Button>
          </div>

          {/* Tabs for List/My Products */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-neutral-200/60 p-1.5 rounded-full mb-10">
              <TabsTrigger
                value="list"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                How It Works
              </TabsTrigger>
              <TabsTrigger
                value="my-products"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                My Products
              </TabsTrigger>
            </TabsList>

            {/* How It Works Tab */}
            <TabsContent value="list" className="animate-fade-in">
              {/* How It Works */}
              <div className="mb-16">
                <h2 className="text-3xl font-serif font-bold text-center mb-12">
                  How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">1. Upload</h3>
                    <p className="text-muted-foreground">
                      Add photos and details of your items. Our team will review and approve within 48 hours.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">2. Get Verified</h3>
                    <p className="text-muted-foreground">
                      We authenticate and quality check every piece to ensure the best for our community.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">3. Earn</h3>
                    <p className="text-muted-foreground">
                      Once sold, receive payment directly. We handle shipping and customer service.
                    </p>
                  </div>
                </div>
              </div>

              {/* Why Sell With Us */}
              <div>
                <h2 className="text-3xl font-serif font-bold text-center mb-12">
                  Why Sell With Us?
                </h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="flex gap-4">
                    <Package className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Hassle-Free Shipping</h4>
                      <p className="text-muted-foreground">
                        We provide prepaid shipping labels. Just pack and ship!
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Trusted Community</h4>
                      <p className="text-muted-foreground">
                        Join thousands of sellers in our sustainable fashion movement.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <DollarSign className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Fair Pricing</h4>
                      <p className="text-muted-foreground">
                        Set your own prices and earn up to 80% of the sale price.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Upload className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Simple Process</h4>
                      <p className="text-muted-foreground">
                        Easy upload, hassle-free selling. We handle the rest.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* My Products Tab */}
            <TabsContent value="my-products" className="animate-fade-in">
              <MyProductsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Sell Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen} modal={true}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
          <div className="sticky top-0 bg-background z-10 p-6 border-b flex-shrink-0">
            <DialogTitle className="text-2xl font-serif">List Your Item</DialogTitle>
          </div>
          <div
            className="overflow-y-auto flex-1 p-6"
            onWheel={(e) => {
              e.stopPropagation();
            }}
          >
            <SellForm onSuccess={() => setIsFormOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Sell;
