import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-serif mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-3xl">
          <p className="text-muted-foreground mb-6">Last updated: January 2025</p>
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, including name, email address, and shipping information.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to process orders, communicate with you, and improve our services.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
