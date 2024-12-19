"use client";
import React from "react";
import { PiUserCircleDuotone } from "react-icons/pi";
import { logout } from "@/app/services/userServices";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUser from "@/app/store/userStore";
import { FaSignOutAlt } from "react-icons/fa";


const Logout = () => {
  const { _id } = useUser((state) => state);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (!_id) {
        toast.error("לא ניתן להתנתק כאשר אין חשבון מחובר.");
        router.push("/pages/signin");
        return;
      }

      await logout();
      toast.success("ההתנתקות בוצעה בהצלחה!");
      router.push("/pages/signin");
    } catch (error) {
      console.error("שגיאה בהתנתקות, נסה שנית", error);
      toast.error("הייתה שגיאה בהתנתקות, אנא נסה שנית.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <PiUserCircleDuotone className="text-8xl mb-14" />
      <h2 className="text-center font-bold text-2xl">
       את/ה בטוח/ה שברצונך להתנתק?
      </h2>
      <button
        onClick={handleLogout}
        className="mt-6 px-8 py-2 text-white bg-blue-500 hover:bg-blue-700 transition-colors rounded-lg"
      >
        <span className="flex items-center">
          התנתק
          <FaSignOutAlt className="mr-2 rotate-180" />
        </span>
      </button>
    </div>
  );
};

export default Logout;
