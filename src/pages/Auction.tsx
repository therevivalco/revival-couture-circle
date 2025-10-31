import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Auction = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Auctions
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Exclusive limited-edition pieces and rare finds. Coming soon.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auction;
