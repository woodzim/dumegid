import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import VisionMissionSection from './components/VisionMissionSection';
import ServicesSection from './components/ServicesSection';
import SkyLaunchTransition from './components/SkyLaunchTransition';
import TeamSection from './components/TeamSection';
import TestimonialAndPartners from './components/TestimonialAndPartners';
import EcosystemGrid from './components/EcosystemGrid';
import ContactSection from './components/ContactSection';
import FooterSection from './components/FooterSection';

export default function Home() {
    return (
        <main
            style={{
                minHeight: '100vh',
                background: 'var(--dmg-bg)',
                color: 'var(--dmg-ink)',
                overflowX: 'clip',
                fontFamily: "'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
        >
            {/* Top Navigation */}
            <Navbar />

            {/* Hero Section */}
            <HeroSection />

            {/* Visi & Misi DUMEG (Scroll to Expand) */}
            <VisionMissionSection />

            {/* Services / Layanan Carousel */}
            <ServicesSection />

            {/* Ekosistem 3D (scroll-driven): 9 cahaya (Asosiasi, Data Center, Layanan Publik)
                lalu masuk ke pesawat: monitor HR, Utilitas, Finance, Bisnis. Menggantikan
                section Portfolio Sistem Asosiasi; komponen lamanya tetap ada di components/. */}
            <SkyLaunchTransition />

            {/* Team / Engineer Logistik */}
            <TeamSection />

            {/* Testimonials & Partners */}
            <TestimonialAndPartners />

            {/* Ecosystem Grid Categories */}
            <EcosystemGrid />

            {/* Contact / CTA */}
            <ContactSection />

            {/* Footer with Giant Watermark */}
            <FooterSection />
        </main>
    );
}