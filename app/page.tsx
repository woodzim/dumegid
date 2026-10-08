import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import VisionMissionSection from './components/VisionMissionSection';
import ServicesSection from './components/ServicesSection';
import AssociationSection from './components/AssociationSection';
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
                background: `linear-gradient(
                    180deg,
                    #3c4eef 0%,
                    #2739da 10%,
                    #1b2ab9 20%,
                    #131d92 30%,
                    #0c1465 40%,
                    #080e3a 52%,
                    #070e3f 58%,
                    #0a124d 65%,
                    #162070 70%,
                    #2937a3 75%,
                    #3c4ed6 80%,
                    #8b97e7 85%,
                    #d3d9f6 90%,
                    #fafbfd 95%,
                    #ffffff 100%
                )`,
                color: '#ffffff',
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

            {/* Portfolio Sistem Asosiasi (APTMI, GPEI, ATTI, DEPALINDO, APBMI Kaltim) */}
            <AssociationSection />

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