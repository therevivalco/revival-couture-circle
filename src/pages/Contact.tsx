import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-serif mb-8">Contact Us</h1>
        <div className="prose prose-lg">
          <p className="text-muted-foreground mb-6">
            Have questions? We'd love to hear from you.
          </p>
          <div className="space-y-4">
            <p><strong>Email:</strong> therevivalco.in@gmail.com</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Hours:</strong> Monday - Friday, 9am - 6pm IST</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
