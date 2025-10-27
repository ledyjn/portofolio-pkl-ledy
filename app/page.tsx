import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ProjectGrid from '@/components/ProjectGrid';
import SkillsSection from '@/components/SkillsSection';
import CircularGallery from '@/components/CircularGallery';
import ContactSection from '@/components/ContactSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SetupNotice from '@/components/SetupNotice';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutSection />
      <ProjectGrid />
      <SkillsSection />
      
      {/* Gallery Section */}
      <section className="py-20 bg-light overflow-hidden">
        <div className="container mx-auto px-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Galeri <span className="text-primary">Dokumentasi</span>
          </h2>
          <p className="text-center text-accent-gray max-w-2xl mx-auto">
            Dokumentasi kegiatan dan momen selama program PKL
          </p>
        </div>
        <div style={{ height: '600px', position: 'relative' }}>
          <CircularGallery 
            bend={3} 
            textColor="#1a1a1a" 
            borderRadius={0.05} 
            scrollEase={0.02}
          />
        </div>
      </section>

      <ContactSection />
      <Footer />
      <SetupNotice />
    </main>
  );
}
