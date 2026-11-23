import type { Metadata } from 'next';
import Universe from '../components/site/universe/Universe';

export const metadata: Metadata = {
    title: 'Semesta',
    description: 'Seluruh sistem dan aplikasi DUMEG dalam satu semesta: asosiasi, data center, layanan publik, dan aplikasi internal.',
};

export default function UniversePage() {
    return (
        <main>
            <h1 className="sr-only">Semesta DUMEG</h1>
            <Universe />
        </main>
    );
}
