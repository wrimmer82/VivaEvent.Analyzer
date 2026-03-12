import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/hooks/useI18n";

const Index = () => {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <Features />
        <Testimonials />
        <Footer />
      </div>
    </I18nProvider>
  );
};

export default Index;
