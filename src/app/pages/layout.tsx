'use client';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  const [isOnline, setIsOnline] = useState(true); // ניהול חיבור אינטרנט

  useEffect(() => {
    // בדיקה ראשונית של מצב החיבור
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20%' }}>
        <h1>אין חיבור לאינטרנט</h1>
        <p>אנא בדוק את החיבור ונסה שוב.</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
        {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
