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
    <div className="min-h-[100dvh] grid grid-rows-[auto,1fr,auto] grid-cols-[minmax(0,1fr)]">

      {/* Header */}
      <div className="sticky top-0 z-50 ">
        <HeaderArhonot />
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

export default Layout