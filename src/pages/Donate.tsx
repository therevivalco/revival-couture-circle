
import { useRef, useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Users, Globe, Check, X, Package, FileText, Truck, Gift } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const carouselImages = [
    { src: "/src/assets/sustainability-image.jpg", alt: "Donated clothes in hands", title: "Give Your Clothes a Second Life.", description: "Partner with us to reduce textile waste and help communities in need." },
    { src: "/src/assets/image1.jpg", alt: "Clothes on a rack", title: "From Your Closet to a New Home.", description: "Your donations help us provide clothing to those who need it most." },
    { src: "/src/assets/clothes.jpg", alt: "Donated clothes in hands", title: "Make a Difference, One Garment at a Time.", description: "Each piece of clothing you donate contributes to a more sustainable future." },
    { src: "/src/assets/donation.jpg", alt: "Clothes on a rack", title: "Join Our Movement of Sustainable Fashion.", description: "Be part of the solution to textile waste." },
    { src: "/src/assets/kid.jpg", alt: "Donated clothes in hands", title: "Declutter with a Purpose.", description: "Give your pre-loved items a new beginning." },
];

const Donate = () => {
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])


  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    howItWorksRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="pt-24 pb-16">
        {/* 1. Schedule Donation Section */}
        <section className="text-center py-20 bg-gradient-to-b from-white to-background animate-fade-in">
          <div className="container mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Ready to Donate? Schedule Your Pickup.
            </h1>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-6 text-base">
              Schedule My Donation Pickup
            </Button>
            <p className="text-muted-foreground mt-4">
              Get a 10% OFF coupon for your next purchase.
            </p>
            <a href="#how-it-works" onClick={handleScrollTo} className="text-accent underline mt-2 inline-block cursor-pointer">
              First time? See How It Works ↓
            </a>
          </div>
        </section>

        {/* 2. Emotional Hero Section */}
        <section className="relative h-[60vh] overflow-hidden">
            <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true }}>
                <CarouselContent>
                    {carouselImages.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="relative h-[60vh]">
                                <img src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full object-cover object-center" style={{ filter: 'brightness(0.6)' }} />
                                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-6 bg-black/30">
                                    <div>
                                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                                            {image.title}
                                        </h2>
                                        <p className="text-lg md:text-xl max-w-2xl">
                                            {image.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20" />
            </Carousel>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {carouselImages.map((_, index) => (
                    <button
                        key={index}
                        onMouseEnter={() => api?.scrollTo(index)}
                        className={`h-2 w-2 rounded-full ${index === current ? 'bg-white' : 'bg-white/50'} transition-all`}
                    />
                ))}
            </div>
        </section>

        <div className="container mx-auto px-6">
          {/* Original Header */}
          <div className="text-center my-16 max-w-3xl mx-auto">
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
              <div className="inline-flex p-4 rounded-xl bg-accent/20 mb-4"><Heart className="h-8 w-8 text-accent-foreground" /></div>
              <p className="text-3xl font-serif font-bold mb-2">2,500+</p><p className="text-muted-foreground">Items Donated</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <div className="inline-flex p-4 rounded-xl bg-accent/20 mb-4"><Users className="h-8 w-8 text-accent-foreground" /></div>
              <p className="text-3xl font-serif font-bold mb-2">15</p><p className="text-muted-foreground">Partner NGOs</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <div className="inline-flex p-4 rounded-xl bg-accent/20 mb-4"><Globe className="h-8 w-8 text-accent-foreground" /></div>
              <p className="text-3xl font-serif font-bold mb-2">8</p><p className="text-muted-foreground">Countries Reached</p>
            </div>
          </div>

          {/* 3. How It Works Section */}
          <section id="how-it-works" ref={howItWorksRef} className="my-20 scroll-mt-20">
            <h2 className="text-center text-4xl font-serif font-bold mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Package, title: "Prepare", description: "Clean, gently used items." },
                { icon: FileText, title: "Form", description: "Provide pickup details." },
                { icon: Truck, title: "Pickup", description: "Schedule free pickup/drop-off." },
                { icon: Gift, title: "Perk", description: "Receive a 10% OFF coupon." },
              ].map((step, index) => (
                <div key={index} className="text-center p-8 rounded-2xl bg-card border border-border shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="inline-flex p-4 rounded-full bg-accent/20 mb-4">
                    <step.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-accent mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Donation Guidelines & FAQ */}
          <section className="my-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-serif font-bold mb-6">What We Accept</h3>
                <ul className="space-y-3">
                  {["Gently used clothing", "Shoes in good condition", "Bags and accessories", "Clean outerwear"].map(item => (
                    <li key={item} className="flex items-center text-green-600"><Check className="h-5 w-5 mr-3 text-green-500" />{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold mb-6">What We Don’t Accept</h3>
                <ul className="space-y-3">
                  {["Torn or stained items", "Used undergarments", "Single socks or shoes", "Household textiles"].map(item => (
                    <li key={item} className="flex items-center text-red-600"><X className="h-5 w-5 mr-3 text-red-500" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="max-w-3xl mx-auto mt-16">
              <h3 className="text-center text-3xl font-serif font-bold mb-8">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is the pickup free?</AccordionTrigger>
                  <AccordionContent>Yes, our donation pickup service is completely free of charge. We aim to make donating as easy as possible.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How long does pickup take?</AccordionTrigger>
                  <AccordionContent>Pickups are typically scheduled within a 3-5 business day window. You can choose a date that works best for you during the scheduling process.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Do I get a tax receipt?</AccordionTrigger>
                  <AccordionContent>We are a for-profit company that partners with non-profits. While we provide a discount coupon as a thank you, we do not issue tax receipts for donations.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Where do my clothes go?</AccordionTrigger>
                  <AccordionContent>Your clothes are sorted and distributed to our network of partner NGOs and community organizations to support various social and environmental causes.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>

          {/* Original CTA - Can be kept or removed */}
          <div className="text-center pt-8">
            <h2 className="text-3xl font-serif font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Your donation can change lives. Start your contribution today.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-base px-10 py-6">
              Schedule My Donation Pickup
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;
