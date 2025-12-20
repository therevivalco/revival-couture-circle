
import { useRef, useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Users, Globe, Check, X, Package, FileText, Truck, Gift, ChevronRight, ChevronLeft, Copy } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { DonationFormModal } from "@/components/DonationFormModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const carouselImages = [
  { src: "/assets/image1.png", alt: "Clothes in boxes", title: "Give Your Clothes a Second Life.", description: "Partner with us to reduce textile waste and help communities in need." },
  { src: "/assets/kid.jpg", alt: "Kid with Clothes", title: "From Your Closet to a New Home.", description: "Your donations help us provide clothing to those who need it most." },
  { src: "/assets/clothes.jpg", alt: "Line of garments", title: "Make a Difference, One Garment at a Time.", description: "Each piece of clothing you donate contributes to a more sustainable future." },
  { src: "/assets/donation.jpg", alt: "Clothes being given", title: "Join Our Movement of Sustainable Fashion.", description: "Be part of the solution to textile waste." },
  { src: "/assets/sustainability-image.jpg", alt: "Donated clothes in hands", title: "Declutter with a Purpose.", description: "Give your pre-loved items a new beginning." },
];

const Donate = () => {
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donations, setDonations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("donate");

  // Check for tab parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'my-donations') {
      setActiveTab('my-donations');
    }
  }, [location]);

  useEffect(() => {
    if (user && activeTab === "my-donations") {
      fetchDonations();
    }
  }, [user, activeTab]);

  const fetchDonations = async () => {
    if (!user?.email) return;
    try {
      const response = await apiFetch(`/api/donations/user/${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      }
    } catch (error) {
      toast.error("Failed to load donations");
    }
  };

  const handleScheduleClick = () => {
    if (!user) {
      toast.error("Please log in to schedule a donation");
      navigate("/login");
    } else {
      setIsModalOpen(true);
    }
  };

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="container mx-auto px-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="donate">Donate</TabsTrigger>
              <TabsTrigger value="my-donations">My Donations</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="donate">
            {/* 1. Schedule Donation Section */}
            <section className="text-center py-20 bg-gradient-to-b from-white to-background animate-fade-in">
              <div className="container mx-auto px-6">
                <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                  Ready to Donate? Schedule Your Pickup.
                </h1>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-6 text-base" onClick={handleScheduleClick}>
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
                    <h3 className="text-2xl font-serif font-bold mb-6">What We Don't Accept</h3>
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

              {/* Original CTA */}
              <div className="text-center pt-8">
                <h2 className="text-3xl font-serif font-bold mb-6">Ready to Make a Difference?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Your donation can change lives. Start your contribution today.
                </p>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-base px-10 py-6" onClick={handleScheduleClick}>
                  Schedule My Donation Pickup
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-donations">
            <div className="container mx-auto px-6 py-12">
              <h2 className="text-4xl font-serif font-bold mb-8">My Donations</h2>
              {donations.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No donations yet</h3>
                    <p className="text-muted-foreground mb-4">Start making a difference by scheduling your first donation</p>
                    <Button onClick={() => setActiveTab("donate")}>Schedule Donation</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <Card key={donation.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg capitalize">{donation.category}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {donation.quantity} items • {donation.state_of_clothes} condition
                                </p>
                              </div>
                              <Badge className={
                                donation.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                              }>
                                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Pickup Date</p>
                                <p className="font-semibold text-sm">
                                  {new Date(donation.pickup_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Pickup Type</p>
                                <p className="font-semibold text-sm capitalize">{donation.pickup_type}</p>
                              </div>
                              {donation.coupon_code && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Coupon Code</p>
                                  <code className="font-semibold text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                                    {donation.coupon_code}
                                  </code>
                                </div>
                              )}
                            </div>
                            {donation.addresses && (
                              <div className="mt-4 p-3 bg-muted rounded-lg">
                                <p className="text-sm">
                                  <span className="font-medium">Address:</span> {donation.addresses.address_line1}, {donation.addresses.city}, {donation.addresses.state}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Donation Form Modal */}
        {user && (
          <DonationFormModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              if (activeTab === "my-donations") {
                fetchDonations();
              }
            }}
            userEmail={user.email}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Donate;
