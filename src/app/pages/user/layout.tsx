import Header from '@/app/components/Header';
import NavBar from '@/app/components/NavBar';
import React from 'react'

const layout = ({ children }: Readonly<{ children: React.ReactNode;}>) => {
   
    // token
    return (
        <div className="min-h-[100dvh] grid grid-rows-[auto,1fr,auto] grid-cols-[minmax(0,1fr)]">

        {/* Header */}
        <div className="sticky top-0 z-50 ">
          <Header />
        </div>

        {/* Body */}
        {children}

        {/* Footer */}
        <div className="sticky bottom-0">
          <NavBar />
        </div>
        
      </div>
    )
}

export default layout