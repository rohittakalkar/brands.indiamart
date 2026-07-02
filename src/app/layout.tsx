import type { Metadata } from 'next';
import PhoneContainer from '@/components/PhoneContainer';
import BottomNav from '@/components/BottomNav';
import { ShortlistProvider } from '@/components/ShortlistProvider';
import { BuyLeadModalProvider } from '@/components/BuyLeadModalProvider';
import '../index.css';

export const metadata: Metadata = {
  title: 'My Google AI Studio App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ShortlistProvider>
          <BuyLeadModalProvider>
            <PhoneContainer>
              <div className="flex-1 flex flex-col overflow-hidden">
                {children}
              </div>
              <BottomNav />
            </PhoneContainer>
          </BuyLeadModalProvider>
        </ShortlistProvider>
      </body>
    </html>
  );
}
