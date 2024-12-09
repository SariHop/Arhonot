'use client';
import NavBar from "../components/NavBar";
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "../components/Header";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>

      <div style={{ paddingTop:"15vh",paddingBottom: "10vh" }}>
      <div style={{ position: 'relative', zIndex: 1000 }}>
          <Header />
        </div>
      {children}
        <NavBar />
      </div>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
