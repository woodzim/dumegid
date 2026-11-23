import type { Metadata } from 'next';
import { Suspense } from 'react';
import ContactFlow from '../components/site/contact/ContactFlow';
import { CONTACT_FLOW } from '../components/site/data/content';

export const metadata: Metadata = {
    title: 'Kontak',
    description: 'Mulai proyek atau kirim pesan singkat ke tim DUMEG.',
};

/** Full-screen contact stage: a construction circle and two rules drawn behind the step flow. */
export default function ContactPage() {
    return (
        <main>
            <h1 className="sr-only">Kontak</h1>
            <section className="relative z-10 flex h-svh w-screen items-center justify-center overflow-hidden">
                <div className="absolute z-10 flex h-full items-center justify-center opacity-50" aria-hidden="true">
                    <svg viewBox="0 0 1006 1080" className="h-full w-auto overflow-visible">
                        <circle cx="503" cy="540" r="500" fill="none" stroke="#c9c9c9" strokeWidth="1" strokeDasharray="4 6" className="contact-circle" />
                        <line x1="0" y1="0" x2="0" y2="1080" stroke="#d6d6d6" strokeWidth="1" className="contact-line" />
                        <line x1="1006" y1="0" x2="1006" y2="1080" stroke="#d6d6d6" strokeWidth="1" className="contact-line" />
                    </svg>
                </div>
                <div className="relative z-20 mx-auto flex h-full w-full flex-col justify-center px-6 py-8 md:max-w-[50vw] md:px-0">
                    <Suspense fallback={<p className="text-center text-[20px] leading-[0.95] tracking-tight text-ink md:text-[36px]">{CONTACT_FLOW.question}</p>}>
                        <ContactFlow />
                    </Suspense>
                </div>
                <div className="pointer-events-none absolute bottom-[3%] w-[200vw] md:bottom-[-6%] md:w-[110vw]" aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/engravings/submarine.png" alt="" className="mx-auto w-[22%] opacity-[0.1]" />
                </div>
            </section>
        </main>
    );
}
