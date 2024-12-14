"use client";
import React from "react";
import { Button, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { logout } from "@/app/services/userServices";
import { useRouter } from "next/navigation"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUser from "@/app/store/userStore";


const { Title } = Typography;

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
      <UserOutlined className="text-5xl mb-14" />   
      <Title level={3} className="text-center">
        האם אתה בטוח שברצונך להתנתק?
      </Title>
      <Button
        type="primary"
        onClick={handleLogout}
        className="mt-6 px-8 py-2 text-white bg-blue-500 hover:bg-blue-700 transition-colors rounded-lg"
      >
        התנתק
      </Button>
    </div>
  );
};

export default Logout;
