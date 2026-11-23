import type { Metadata } from 'next';
import Hero from '../components/site/home/Hero';
import ScriptMarquee from '../components/site/ScriptMarquee';
import WorksList from '../components/site/home/WorksList';
import TrustedBy from '../components/site/home/TrustedBy';
import Disciplines from '../components/site/home/Disciplines';
import Statement from '../components/site/home/Statement';
import Reel from '../components/site/home/Reel';
import BuildContact from '../components/site/home/BuildContact';
import Imagery from '../components/site/home/Imagery';
import SiteFooter from '../components/site/SiteFooter';

export const metadata: Metadata = {
    title: 'Tentang',
    description: 'Tentang DUMEG: rumah teknologi maritim dari Indonesia. Angkutan, simpul pelabuhan dan gudang, aplikasi pendukung, dan media center dalam satu ekosistem.',
};

export default function AboutPage() {
    return (
        <>
            <main className="w-full overflow-x-hidden pb-[9.5rem] md:pb-64">
                <Hero />
                <section aria-labelledby="works-title">
                    <h2 id="works-title" className="sr-only">
                        Karya DUMEG
                    </h2>
                    <div className="mt-[7.5rem] md:mt-60">
                        <ScriptMarquee word="Karya" index="01" image="/images/engravings/dolphin.png" text="Oleh DUMEG" />
                    </div>
                    <WorksList />
                </section>
                <TrustedBy />
                <section aria-labelledby="services-title">
                    <h2 id="services-title" className="sr-only">
                        Layanan DUMEG
                    </h2>
                    <div className="mt-32 md:mt-[23rem]">
                        <ScriptMarquee word="Layanan" index="02" image="/images/engravings/submarine.png" text="Oleh DUMEG" wideImage />
                    </div>
                    <Disciplines />
                </section>
                <Statement />
                <Reel src="/videos/12028859_1920_1080_24fps.mp4" />
                <BuildContact />
                <Imagery />
            </main>
            <SiteFooter />
        </>
    );
}
