'use client';
import NavBar from "../components/NavBar";
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import Header from "../components/Header";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>

      {/* <div style={{ paddingTop:"15vh",paddingBottom: "10vh" }}> */}
      <div className="min-h-[100dvh] grid grid-rows-[auto,1fr,auto] grid-cols-[minmax(0,1fr)]">

        {/* Header */}
        {/* <div className="sticky top-0 z-50 ">
          <Header />
        </div> */}

        {/* Body */}
        {children}

        {/* Footer */}
        <div className="sticky bottom-0">
          <NavBar />
        </div>
        
      </div>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
