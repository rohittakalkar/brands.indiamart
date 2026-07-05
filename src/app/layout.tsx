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
import { ThemeProvider } from '@/components/ThemeProvider';
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

// Applies the dark class before React hydrates or paint happens — without this, the page
// would render light-mode-styled markup first and only flip to dark a moment later once
// ThemeProvider's own effect runs, a visible flash on every load for a buyer who's chosen
// dark mode. Reads localStorage first (an explicit prior choice), falling back to the OS
// preference only when the buyer has never set one.
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
