import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ULTRA belleza | Maquillaje, Capilar y Cuidado Personal',
    template: '%s | ULTRA belleza',
  },
  description:
    'Tu tienda de belleza accesible y moderna. Maquillaje, cuidado capilar y dermocosméticos premium para mujeres colombianas. Envío a todo Colombia.',
  keywords: [
    'maquillaje Colombia',
    'cuidado capilar',
    'dermocosméticos',
    'belleza accesible',
    'tienda de belleza',
    'cosméticos colombianos',
    'ULTRA belleza',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ultra.com.co'),
  openGraph: {
    title: 'ULTRA belleza | Tu belleza, accesible y moderna',
    description: 'Maquillaje, capilar y cuidado personal con estética premium accesible.',
    siteName: 'ULTRA belleza',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ULTRA belleza',
    description: 'Tu tienda de belleza accesible y moderna en Colombia.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <Navbar />
        <main className="flex-1 pt-16 lg:pt-[4.5rem]">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: 'var(--font-inter)', fontSize: '14px' },
          }}
        />
      </body>
    </html>
  );
}
