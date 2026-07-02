import type { Metadata } from 'next';
import { Sora, Inter, IBM_Plex_Mono } from 'next/font/google';
import AppShell from '@/components/AppShell';
import DesktopNav from '@/components/DesktopNav';
import BottomNav from '@/components/BottomNav';
import { ShortlistProvider } from '@/components/ShortlistProvider';
import { BuyLeadModalProvider } from '@/components/BuyLeadModalProvider';
import { RecentlyViewedProvider } from '@/components/RecentlyViewedProvider';
import { QuoteBasketProvider } from '@/components/QuoteBasketProvider';
import '../index.css';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Brands — Discover the Right Branded Industrial Product | IndiaMART',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body>
        <ShortlistProvider>
          <RecentlyViewedProvider>
            <QuoteBasketProvider>
              <BuyLeadModalProvider>
                <AppShell>
                  <DesktopNav />
                  <div className="flex-1 flex flex-col pb-14 md:pb-0">
                    {children}
                  </div>
                  <BottomNav />
                </AppShell>
              </BuyLeadModalProvider>
            </QuoteBasketProvider>
          </RecentlyViewedProvider>
        </ShortlistProvider>
      </body>
    </html>
  );
}
