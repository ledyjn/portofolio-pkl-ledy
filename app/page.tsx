import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ProjectGrid from '@/components/ProjectGrid';
import SkillsSection from '@/components/SkillsSection';
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
      <ContactSection />
      <Footer />
      <SetupNotice />
    </main>
  );
}
