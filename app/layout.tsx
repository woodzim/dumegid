import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DUMEG — Solusi Digital Maritim, Pelabuhan & Logistik",
  description: "PT Duta Meta Graha (DUMEG) — Ekosistem digitalisasi terpadu untuk efisiensi operasional maritim, pelabuhan, dan logistik modern di Indonesia.",
  keywords: "maritim, logistik, pelabuhan, digitalisasi, teknologi, DUMEG, tally digital, YADRI",
  openGraph: {
    title: "DUMEG — Solusi Digital Maritim, Pelabuhan & Logistik",
    description: "Satu input, satu data, banyak proses untuk operasional maritim dan logistik tanpa hambatan.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={bebasNeue.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}