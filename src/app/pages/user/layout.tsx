"use client";
import HeaderArhonot from '@/app/components/header/Header';
import NavBar from '@/app/components/NavBar';
import React, { useEffect } from 'react'
import { checkTokenValidity } from '@/app/services/tokenService'
import { useRouter } from 'next/navigation'; // ייבוא מתוך next/navigation
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  const router = useRouter(); // שימוש ב-router מתוך next/navigation
  useEffect(() => {
    const checkToken = async () => {
      try {
        // קריאה לפונקציה שבודקת את תקינות הטוקן
        const isTokenValid = await checkTokenValidity();
        if (isTokenValid) {
          console.log('Token is valid');
        } else {
          toast.warn('פג תוקף החיבור, יש להתחבר על מנת להמשיך לקבל שירות', {
            position: 'top-right',
            autoClose: 3000,
          });
          router.push('/pages/signin'); // כאן אנחנו מפנים לעמוד הבית
        }
      } catch (error) {
        console.error('Error checking token validity:', error);
      }
    };

    checkToken(); // קריאה לפונקציה בזמן שהקומפוננטה נטענת
  }, []);

  // token
  return (
    <div className="min-h-[100dvh] grid grid-rows-[auto,1fr,auto] lg:grid-rows-[auto,1fr] grid-cols-[minmax(0,1fr)]">
      {/* Header and navBar for big screens */}
      <div className="hidden md:block md:sticky md:top-0 z-50 md:bg-white md:shadow-md">
        <div className="flex flex-col">
          <div className="z-50">
            <HeaderArhonot />
          </div>
          <div className="z-40">
            <NavBar />
          </div>
        </div>
      </div>

      {/* Header for small screens */}
      <div className="md:hidden sticky top-0 z-50">
        <HeaderArhonot />
      </div>

      {/* NavBar for small screens */}
      <div className="md:hidden sticky bottom-0 z-40 bg-white shadow-lg">
        <NavBar />
      </div>

      {/* Body */}
      <div className="row-start-2 overflow-hidden">
        {children}
      </div>

      {/* <div className="sticky top-0 z-50">
        <HeaderArhonot />
      </div>

      {/* NavBar */}
      {/* <div className="sticky bottom-0 z-40 bg-white shadow-lg lg:fixed lg:top-[calc(100px)] lg:left-0 lg:right-0 lg:h-[50px]">
        <NavBar />
      </div> */}

      {/* Body */}
      {/* <div className="row-start-2 lg:mt-[calc(80px)]">
        {children}
      </div> */}
    </div>









  );
}

export default Layout
