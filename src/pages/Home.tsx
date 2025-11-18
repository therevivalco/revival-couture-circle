import { useEffect, useRef } from "react";
import { ShoppingBag, Package, Gavel, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import RevealText from "@/components/RevealText";
import ParallaxImage from "@/components/ParallaxImage";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  useEffect(() => {
    // Kinetic typography animation
    const chars = titleRef.current?.querySelectorAll('.char');
    if (chars) {
      gsap.fromTo(
        chars,
        {
          opacity: 0,
          y: 100,
          rotateX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.03,
          ease: 'power4.out',
          delay: 0.5,
        }
      );
    }

    // Feature cards stagger animation
    gsap.fromTo(
      '.feature-card',
      {
        opacity: 0,
        y: 80,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 70%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Stats counter animation
    gsap.utils.toArray('.stat-number').forEach((stat: any) => {
      const target = stat.getAttribute('data-target');
      gsap.fromTo(
        stat,
        { innerText: 0 },
        {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: stat,
            start: 'top 80%',
          },
          onUpdate: function () {
            stat.innerText = Math.ceil(stat.innerText).toLocaleString();
          },
        }
      );
    });
  }, []);

  const titleText = "Rewear. Relove. Revive.";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Parallax */}
      <motion.section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroScale }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("/assets/hero-image.jpg")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <div className="bg-background/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-5xl mx-auto">
            <h1
              ref={titleRef}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 tracking-tight leading-tight text-foreground"
              style={{ 
                perspective: '1000px',
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 255, 255, 0.1)'
              }}
            >
              {titleText.split('').map((char, index) => (
                <span
                  key={index}
                  className="char inline-block"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>

            <RevealText delay={1.5}>
              <p className="text-lg md:text-xl text-foreground/90 mb-12 max-w-2xl mx-auto leading-relaxed" style={{ textShadow: '0 1px 10px rgba(0, 0, 0, 0.3)' }}>
                Discover luxury pre-loved fashion with purpose. Every piece tells a story, every purchase makes an impact.
              </p>
            </RevealText>

            <RevealText delay={1.8}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button size="lg" className="text-base px-8 py-6 rounded-full hover-magnetic">
                    Explore Collections
                  </Button>
                </Link>
                <Link to="/sell">
                  <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-full hover-magnetic">
                    Sell With Us
                  </Button>
                </Link>
              </div>
            </RevealText>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-32">
        <RevealText className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">How It Works</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple ways to be part of the sustainable fashion movement
          </p>
        </RevealText>

        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="feature-card">
            <FeatureCard
              icon={ShoppingBag}
              title="Buy"
              description="Shop curated pre-loved pieces from premium brands. Quality verified, sustainability guaranteed."
              link="/shop"
              colorClass="bg-olive/20 text-olive"
            />
          </div>
          <div className="feature-card">
            <FeatureCard
              icon={Package}
              title="Sell"
              description="Give your clothes a second story. List your pre-loved items and earn while making an impact."
              link="/sell"
              colorClass="bg-sage/20 text-sage"
            />
          </div>
          <div className="feature-card">
            <FeatureCard
              icon={Gavel}
              title="Auction"
              description="Bid on exclusive limited-edition pieces. Rare finds for those who appreciate fashion history."
              link="/auction"
              colorClass="bg-rose/20 text-rose"
            />
          </div>
          <div className="feature-card">
            <FeatureCard
              icon={Heart}
              title="Donate"
              description="Give back, look forward. Donate pre-loved clothes to partner NGOs supporting communities."
              link="/donate"
              colorClass="bg-accent/20 text-accent-foreground"
            />
          </div>
        </div>
      </section>

      {/* Storytelling Section with Parallax */}
      <section className="bg-muted/30 py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <RevealText delay={0.2}>
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                  What Revival Means
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Fashion shouldn't cost the earth. Every garment at The Revival Co. represents a choice — to wear consciously, buy responsibly, and contribute to a circular fashion economy.
                </p>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  We believe in giving clothes a second chance, reducing waste, and creating a community that values quality over quantity. When you shop with us, you're not just buying fashion — you're investing in a sustainable future.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div>
                    <p className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
                      <span className="stat-number" data-target="5000">0</span>+
                    </p>
                    <p className="text-sm text-muted-foreground">Pieces Rehomed</p>
                  </div>
                  <div>
                    <p className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
                      <span className="stat-number" data-target="12">0</span> Tons
                    </p>
                    <p className="text-sm text-muted-foreground">Waste Saved</p>
                  </div>
                </div>
              </div>
            </RevealText>

            <ParallaxImage
              src="/assets/sustainability-image.jpg"
              alt="Sustainable fashion"
              className="h-[600px] rounded-2xl"
              speed={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-32">
        <RevealText className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
            Join the Movement
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Be part of a community that believes fashion can be both beautiful and responsible. Start your conscious style journey today.
          </p>
          <Link to="/shop">
            <Button size="lg" className="text-base px-10 py-6 rounded-full mt-6 hover-magnetic">
              Start Shopping
            </Button>
          </Link>
        </RevealText>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
