import { Asterisk, Notch } from './DmgKit';

export default function EcosystemGrid() {
    const categories = [
        {
            num: '01',
            title: 'Aplikasi Utama',
            desc: 'Pondasi utama alur logistik',
            apps: ['Pintu Segala Akses', 'Core Dispatch Engine'],
        },
        {
            num: '02',
            title: 'Aplikasi Operasional',
            desc: 'Sentral armada & kargo',
            apps: ['Telsade', 'SamudraHub', 'Gudang Muda'],
        },
        {
            num: '03',
            title: 'Aplikasi Lapangan',
            desc: 'Alat kru dermaga & tally',
            apps: ['YADRI', 'YARS', 'Yardtruck', 'EMPTKX', 'Portex'],
        },
        {
            num: '04',
            title: 'Aplikasi Pelengkap',
            desc: 'Billing & data analytics',
            apps: ['BPRN', 'AS-DATASCAP'],
        },
    ];

    const totalApps = categories.reduce((sum, cat) => sum + cat.apps.length, 0);

    return (
        <section id="ekosistem" className="dmg-section" aria-label="Ekosistem Aplikasi">
            <div className="dmg-container eco-grid">
                {/* Summary: accent feature card */}
                <div className="dmg-card dmg-card-accent eco-hero">
                    <Notch corner="tl" className="dmg-notch-icon">
                        <Asterisk size={28} />
                    </Notch>
                    <div className="dmg-num eco-total">{totalApps}</div>
                    <div className="dmg-mono eco-hero-label">
                        Aplikasi dalam
                        <br />
                        satu ekosistem
                    </div>
                    <Notch corner="br">dumeg.ecosystem</Notch>
                </div>

                {categories.map((cat, i) => (
                    <div key={cat.title} className="dmg-card eco-card">
                        <Notch corner="tr">{cat.apps.length} aplikasi</Notch>
                        <div className="dmg-num eco-fraction">
                            {i + 1}/{categories.length}
                        </div>
                        <div>
                            <h3 className="dmg-mono eco-title">{cat.title}</h3>
                            <p className="dmg-label eco-desc">{cat.desc}</p>
                            <div className="dmg-pill-row">
                                {cat.apps.map((app) => (
                                    <span key={app} className="dmg-pill">
                                        {app}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .eco-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 12px;
                }
                .eco-hero {
                    grid-column: span 2;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    min-height: 320px;
                    padding: 28px;
                }
                .eco-total {
                    align-self: flex-end;
                    font-size: clamp(120px, 15vw, 220px);
                }
                .eco-hero-label {
                    align-self: flex-end;
                    text-align: right;
                    font-size: clamp(16px, 1.8vw, 24px);
                    line-height: 1.2;
                    margin-top: 20px;
                    padding-bottom: 40px;
                }
                .eco-card {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 32px;
                    min-height: 320px;
                }
                .eco-fraction { font-size: clamp(44px, 4.4vw, 64px); }
                .eco-title { font-size: clamp(16px, 1.5vw, 20px); line-height: 1.2; }
                .eco-desc { margin: 8px 0 16px; }

                @media (max-width: 1024px) {
                    .eco-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                @media (max-width: 640px) {
                    .eco-grid { grid-template-columns: 1fr; }
                    .eco-hero { grid-column: span 1; min-height: 280px; }
                    .eco-card { min-height: 0; }
                }
            `}</style>
        </section>
    );
}
