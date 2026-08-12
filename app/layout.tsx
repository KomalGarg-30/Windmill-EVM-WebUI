import type { Metadata, Viewport } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/context/WalletContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Windmill Exchange | Decentralized Dynamic Matchmaking Protocol',
  description:
    'A decentralized on-chain order matching engine with configurable dynamic pricing curves and autonomous keeper matching. Deploy across Ethereum, Polygon, Base, BSC, and more.',
  keywords: [
    'decentralized exchange',
    'DEX',
    'EVM',
    'order matching',
    'dynamic pricing',
    'keeper network',
    'DeFi',
    'Windmill Exchange',
    'Stability Nexus',
  ],
  authors: [{ name: 'Stability Nexus', url: 'https://stability.nexus' }],
  openGraph: {
    title: 'Windmill Exchange | Decentralized Dynamic Matchmaking Protocol',
    description:
      'On-chain order matching engine with configurable dynamic pricing curves and autonomous keeper matching.',
    type: 'website',
    siteName: 'Windmill Exchange',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Windmill Exchange',
    description: 'Decentralized dynamic pricing order matching on EVM chains.',
    creator: '@StabilityNexus',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <body className={`${inter.variable} antialiased min-h-screen bg-white text-black`}>
        <WalletProvider>
          <Navbar />
          {children}
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
