import '../styles/globals.css';
import '../styles/style.css';
import '../styles/scroll3d.css';
import '../styles/shop.css';
import { Montserrat, Roboto, Ubuntu } from 'next/font/google';
import Sprite from '@/components/Sprite';
import RevealObserver from '@/components/RevealObserver';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ubuntu',
  display: 'swap',
});

export const metadata = {
  title: 'BMY Collection & Kaftan — Premium Atelier & Mineral Elegance',
  description:
    'BMY Collection & Kaftan — bespoke and ready-to-wear menswear, hand-tailored in Gombe. Caftans, agbada, shadda, yards, vests, trousers, shoes, watches, and luxury accessories.',
  metadataBase: new URL('http://localhost:8080'),
  openGraph: {
    title: 'BMY Collection & Kaftan — Menswear Atelier, Gombe',
    description:
      'Bespoke and ready-to-wear menswear, hand-tailored in Gombe.',
    locale: 'en_NG',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111111',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${roboto.variable} ${ubuntu.variable}`}
    >
      <body className="font-body bg-[#F6F6F6] text-[#111111] antialiased selection:bg-[#FFCB74] selection:text-[#111111]">
        <Sprite />
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
