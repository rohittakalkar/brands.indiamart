import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas font-sans antialiased flex flex-col">
      {children}
    </div>
  );
}
