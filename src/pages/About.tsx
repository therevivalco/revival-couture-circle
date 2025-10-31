import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import sustainabilityImage from "@/assets/sustainability-image.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Our Story
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Building a future where fashion is circular, conscious, and beautiful.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="relative h-[400px] rounded-2xl overflow-hidden mb-12">
              <img 
                src={sustainabilityImage}
                alt="Sustainable fashion mission"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-serif font-bold mb-6">What We Believe</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The Revival Co. was born from a simple belief: fashion can be both luxurious and responsible. We saw an industry creating waste, and wardrobes full of unworn clothes. We imagined a better way — one where every garment has value, every choice has meaning, and style doesn't cost the earth.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We're more than a marketplace. We're a movement of conscious consumers who believe that pre-loved fashion deserves celebration, not stigma. Every piece in our collection has a story, and by choosing revival over retail, you're writing the next chapter.
              </p>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="bg-muted/30 rounded-2xl p-12 mb-20">
            <h2 className="text-3xl font-serif font-bold mb-12 text-center">Our Impact So Far</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl font-serif font-bold text-primary mb-2">5,000+</p>
                <p className="text-sm text-muted-foreground">Pieces Rehomed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif font-bold text-primary mb-2">12 Tons</p>
                <p className="text-sm text-muted-foreground">Waste Saved</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif font-bold text-primary mb-2">2,500+</p>
                <p className="text-sm text-muted-foreground">Items Donated</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif font-bold text-primary mb-2">15</p>
                <p className="text-sm text-muted-foreground">NGO Partners</p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-12 text-center">Our Values</h2>
            <div className="space-y-8">
              <div className="border-l-4 border-olive pl-6">
                <h3 className="text-xl font-serif font-semibold mb-2">Quality Over Quantity</h3>
                <p className="text-muted-foreground">
                  We carefully curate every piece, ensuring only the finest pre-loved items make it to our collection. Each garment is authenticated, quality-checked, and ready to be worn with pride.
                </p>
              </div>
              
              <div className="border-l-4 border-sage pl-6">
                <h3 className="text-xl font-serif font-semibold mb-2">Transparency Always</h3>
                <p className="text-muted-foreground">
                  From pricing to impact, we believe in complete transparency. You deserve to know where your clothes come from, where they go, and the difference they make.
                </p>
              </div>
              
              <div className="border-l-4 border-rose pl-6">
                <h3 className="text-xl font-serif font-semibold mb-2">Community First</h3>
                <p className="text-muted-foreground">
                  We're building a community of conscious consumers who support each other, share values, and create positive change together. Your voice matters here.
                </p>
              </div>
              
              <div className="border-l-4 border-accent pl-6">
                <h3 className="text-xl font-serif font-semibold mb-2">Sustainable by Design</h3>
                <p className="text-muted-foreground">
                  Sustainability isn't an afterthought — it's embedded in everything we do. From our packaging to our partnerships, we prioritize the planet at every step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
