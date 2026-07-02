import React from 'react';

interface PhoneContainerProps {
  children: React.ReactNode;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function PhoneContainer({ children }: PhoneContainerProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center font-sans antialiased">
      {/* 
        Clean B2B Application frame. 
        Takes up full screen on mobile, and displays as a sleek, highly-polished 
        web viewport card centered on desktop without bulky physical device frames.
      */}
      <div 
        id="app-container" 
        className="w-full max-w-md h-screen md:h-[820px] md:my-6 bg-white md:rounded-3xl md:shadow-2xl md:border md:border-slate-200/80 overflow-hidden flex flex-col relative"
      >
        {children}
      </div>
    </div>
  );
}
