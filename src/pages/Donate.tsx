import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Users, Globe } from "lucide-react";

const Donate = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Give Back, Look Forward
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Donate your pre-loved clothes to support communities in need. Every garment creates impact beyond fashion.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <div className="inline-flex p-4 rounded-xl bg-accent/20 mb-4">
                <Heart className="h-8 w-8 text-accent-foreground" />
              </div>
              <p className="text-3xl font-serif font-bold mb-2">2,500+</p>
              <p className="text-muted-foreground">Items Donated</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <div className="inline-flex p-4 rounded-xl bg-olive/20 mb-4">
                <Users className="h-8 w-8 text-olive" />
              </div>
              <p className="text-3xl font-serif font-bold mb-2">15</p>
              <p className="text-muted-foreground">Partner NGOs</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <div className="inline-flex p-4 rounded-xl bg-sage/20 mb-4">
                <Globe className="h-8 w-8 text-sage" />
              </div>
              <p className="text-3xl font-serif font-bold mb-2">8</p>
              <p className="text-muted-foreground">Countries Reached</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-muted/30 rounded-2xl p-12">
              <h2 className="text-3xl font-serif font-bold mb-6">How Your Donation Helps</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  When you donate your pre-loved clothes to The Revival Co., you're not just decluttering your wardrobe — you're providing essential clothing to communities in need, supporting sustainable practices, and reducing textile waste.
                </p>
                <p>
                  We partner with verified NGOs and charitable organizations to ensure your donations reach those who need them most. From supporting refugees and displaced families to empowering women's cooperatives, your contribution creates real, lasting impact.
                </p>
                <p>
                  Every item is carefully sorted, cleaned, and distributed with dignity and respect. We believe in the power of clothing to restore confidence, provide warmth, and create opportunities.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold">What We Accept</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border">
                  <h3 className="font-semibold mb-2">Clothing</h3>
                  <p className="text-sm text-muted-foreground">
                    All gently used clothing for men, women, and children in good, wearable condition.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-border">
                  <h3 className="font-semibold mb-2">Accessories</h3>
                  <p className="text-sm text-muted-foreground">
                    Bags, scarves, belts, and other accessories that are clean and functional.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-border">
                  <h3 className="font-semibold mb-2">Shoes</h3>
                  <p className="text-sm text-muted-foreground">
                    Footwear in good condition with minimal wear and tear.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-border">
                  <h3 className="font-semibold mb-2">Outerwear</h3>
                  <p className="text-sm text-muted-foreground">
                    Coats, jackets, and sweaters — especially needed during winter months.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <h2 className="text-3xl font-serif font-bold mb-6">Ready to Make a Difference?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Your donation can change lives. Start your contribution today.
              </p>
              <Button size="lg" className="text-base px-10 py-6 rounded-full">
                Donate Now
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;
