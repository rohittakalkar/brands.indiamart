import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import AppShell from '@/components/AppShell';
import DesktopNav from '@/components/DesktopNav';
import BottomNav from '@/components/BottomNav';
import MobileSearchBar from '@/components/MobileSearchBar';
import PageContentFrame from '@/components/PageContentFrame';
import { ShortlistProvider } from '@/components/ShortlistProvider';
import { BuyLeadModalProvider } from '@/components/BuyLeadModalProvider';
import { RecentlyViewedProvider } from '@/components/RecentlyViewedProvider';
import { SearchHistoryProvider } from '@/components/SearchHistoryProvider';
import { QuoteBasketProvider } from '@/components/QuoteBasketProvider';
import { ScrollChromeProvider } from '@/components/ScrollChromeProvider';
import { NavigationHistoryProvider } from '@/components/NavigationHistoryProvider';
import '../index.css';

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
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <body suppressHydrationWarning>
        <NavigationHistoryProvider>
          <ShortlistProvider>
            <RecentlyViewedProvider>
              <SearchHistoryProvider>
                <QuoteBasketProvider>
                  <ScrollChromeProvider>
                    <BuyLeadModalProvider>
                      <AppShell>
                        <DesktopNav />
                        <MobileSearchBar />
                        {/* pb-20 (80px), not pb-14 (56px, the nav's exact height) — each page's own
                            view component typically owns an inner overflow-y-auto scroll region, so
                            padding here must clear the fixed 56px BottomNav with real breathing room,
                            not land flush against it. Top clearance for MobileSearchBar is conditional
                            (see PageContentFrame) since that bar hides itself on Home. */}
                        <PageContentFrame>
                          {children}
                        </PageContentFrame>
                        <BottomNav />
                      </AppShell>
                    </BuyLeadModalProvider>
                  </ScrollChromeProvider>
                </QuoteBasketProvider>
              </SearchHistoryProvider>
            </RecentlyViewedProvider>
          </ShortlistProvider>
        </NavigationHistoryProvider>
      </body>
    </html>
  );
}
