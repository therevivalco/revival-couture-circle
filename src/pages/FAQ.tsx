import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-serif mb-8">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="w-full max-w-3xl">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does shipping work?</AccordionTrigger>
            <AccordionContent>
              We offer free standard shipping on all orders over Rs.1999. Standard shipping typically takes 5-7 business days.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What is your return policy?</AccordionTrigger>
            <AccordionContent>
              We accept returns within 30 days of purchase. Items must be unworn and in original condition.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How do I sell my clothes?</AccordionTrigger>
            <AccordionContent>
              Visit our Sell page to learn more about our selling process. We accept gently used, quality clothing items.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Are your products authentic?</AccordionTrigger>
            <AccordionContent>
              Yes, all items are carefully authenticated by our team of experts before listing.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
