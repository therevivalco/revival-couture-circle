import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-serif mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-3xl">
          <p className="text-muted-foreground mb-6">Last updated: January 2025</p>
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using The Revival Co, you accept and agree to be bound by these terms.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Use of Service</h2>
            <p className="text-muted-foreground">
              You agree to use our service only for lawful purposes and in accordance with these terms.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-serif mb-4">Product Descriptions</h2>
            <p className="text-muted-foreground">
              We strive to provide accurate product descriptions, but do not warrant that descriptions are error-free.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
