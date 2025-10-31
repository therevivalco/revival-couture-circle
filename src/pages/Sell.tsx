import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, DollarSign, Package } from "lucide-react";

const Sell = () => {
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
            <p className="text-lg text-muted-foreground leading-relaxed">
              Turn your wardrobe into opportunity. List your pre-loved luxury items and join our community of conscious sellers.
            </p>
          </div>

          {/* How It Works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-4 p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors">
              <div className="inline-flex p-4 rounded-xl bg-olive/20">
                <Upload className="h-8 w-8 text-olive" />
              </div>
              <h3 className="text-xl font-serif font-semibold">1. Upload</h3>
              <p className="text-muted-foreground">
                Add photos and details of your items. Our team will review and approve within 48 hours.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors">
              <div className="inline-flex p-4 rounded-xl bg-sage/20">
                <CheckCircle className="h-8 w-8 text-sage" />
              </div>
              <h3 className="text-xl font-serif font-semibold">2. Get Verified</h3>
              <p className="text-muted-foreground">
                We authenticate and quality check every piece to ensure the best for our community.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors">
              <div className="inline-flex p-4 rounded-xl bg-rose/20">
                <DollarSign className="h-8 w-8 text-rose" />
              </div>
              <h3 className="text-xl font-serif font-semibold">3. Earn</h3>
              <p className="text-muted-foreground">
                Receive payment when your item sells. Fast, secure, and transparent process.
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-muted/30 rounded-2xl p-12 mb-16">
            <h2 className="text-3xl font-serif font-bold mb-8 text-center">Why Sell With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Package className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Free Shipping Kit</h4>
                  <p className="text-muted-foreground">
                    We provide everything you need to safely send your items to us.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Expert Authentication</h4>
                  <p className="text-muted-foreground">
                    Professional verification ensures trust and quality for buyers.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <DollarSign className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Competitive Pricing</h4>
                  <p className="text-muted-foreground">
                    Earn up to 70% of the selling price with our transparent commission structure.
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

          {/* CTA */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-6">Ready to Start Selling?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our community of conscious sellers and turn your pre-loved fashion into earnings.
            </p>
            <Button size="lg" className="text-base px-10 py-6 rounded-full">
              List Your Items
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;
