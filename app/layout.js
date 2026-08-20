import '../styles/style.css';
import '../styles/scroll3d.css';
import '../styles/shop.css';
import Sprite from '@/components/Sprite';
import RevealObserver from '@/components/RevealObserver';

export const metadata = {
  title: 'BMY Collection — Menswear Atelier, Gombe',
  description:
    'BMY Collection — bespoke and ready-to-wear menswear, hand-tailored in Gombe. Caftans, agbada, shadda, yards, vests, trousers, shoes, watches, wristbands, perfumes and caps.',
  metadataBase: new URL('http://localhost:8080'),
  openGraph: {
    title: 'BMY Collection — Menswear Atelier, Gombe',
    description:
      'Bespoke and ready-to-wear menswear, hand-tailored in Gombe.',
    locale: 'en_NG',
    type: 'website'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Sprite />
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
