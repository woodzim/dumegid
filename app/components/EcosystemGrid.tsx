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

    return (
        <section id="ekosistem" className="dmg-section" style={{ paddingTop: 40, paddingBottom: 40 }}>
            <div className="dmg-container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: 20,
                }}>
                    {categories.map((cat) => (
                        <div
                            key={cat.title}
                            className="dmg-card-glass"
                            style={{
                                padding: 26,
                                borderRadius: 24,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: 220,
                            }}
                        >
                            <div>
                                <span style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: '0.1em',
                                    color: '#a4beff',
                                    display: 'block',
                                    marginBottom: 6,
                                }}>
                                    {cat.num}
                                </span>
                                <h3 style={{
                                    fontSize: 19,
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    letterSpacing: '-0.01em',
                                    marginBottom: 2,
                                }}>
                                    {cat.title}
                                </h3>
                                <p style={{ fontSize: 12, color: '#cbd8fc', marginBottom: 20 }}>
                                    {cat.desc}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {cat.apps.map((app) => (
                                    <div
                                        key={app}
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: '#ffffff',
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            padding: '6px 12px',
                                            borderRadius: 8,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                                        <span style={{ width: 5, height: 5, borderRadius: 9999, background: '#a4beff' }} />
                                        <span>{app}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
