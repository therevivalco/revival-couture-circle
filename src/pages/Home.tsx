import { ShoppingBag, Package, Gavel, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import heroImage from "@/assets/hero-image.jpg";
import sustainabilityImage from "@/assets/sustainability-image.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        
        <div className="relative z-10 text-center px-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
            Rewear. Relove. Revive.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover luxury pre-loved fashion with purpose. Every piece tells a story, every purchase makes an impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="text-base px-8 py-6 rounded-full">
                Explore Collections
              </Button>
            </Link>
            <Link to="/sell">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-full">
                Sell With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple ways to be part of the sustainable fashion movement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={ShoppingBag}
            title="Buy"
            description="Shop curated pre-loved pieces from premium brands. Quality verified, sustainability guaranteed."
            link="/shop"
            colorClass="bg-olive/20 text-olive"
          />
          <FeatureCard
            icon={Package}
            title="Sell"
            description="Give your clothes a second story. List your pre-loved items and earn while making an impact."
            link="/sell"
            colorClass="bg-sage/20 text-sage"
          />
          <FeatureCard
            icon={Gavel}
            title="Auction"
            description="Bid on exclusive limited-edition pieces. Rare finds for those who appreciate fashion history."
            link="/auction"
            colorClass="bg-rose/20 text-rose"
          />
          <FeatureCard
            icon={Heart}
            title="Donate"
            description="Give back, look forward. Donate pre-loved clothes to partner NGOs supporting communities."
            link="/donate"
            colorClass="bg-accent/20 text-accent-foreground"
          />
        </div>
      </section>

      {/* Storytelling Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-serif font-bold">
                What Revival Means
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fashion shouldn't cost the earth. Every garment at The Revival Co. represents a choice — to wear consciously, buy responsibly, and contribute to a circular fashion economy.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe in giving clothes a second chance, reducing waste, and creating a community that values quality over quantity. When you shop with us, you're not just buying fashion — you're investing in a sustainable future.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div>
                  <p className="text-3xl font-serif font-bold text-primary mb-2">5,000+</p>
                  <p className="text-sm text-muted-foreground">Pieces Rehomed</p>
                </div>
                <div>
                  <p className="text-3xl font-serif font-bold text-primary mb-2">12 Tons</p>
                  <p className="text-sm text-muted-foreground">Waste Saved</p>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <img 
                src={sustainabilityImage}
                alt="Sustainable fashion"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-serif font-bold">
            Join the Movement
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Be part of a community that believes fashion can be both beautiful and responsible. Start your conscious style journey today.
          </p>
          <Link to="/shop">
            <Button size="lg" className="text-base px-10 py-6 rounded-full mt-4">
              Start Shopping
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
