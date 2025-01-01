"use client";
import {
  BellOutlined,
  CalendarOutlined,
  PlusOutlined,
  ProductOutlined,
  SkinOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, MenuProps, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useAlertsCounter, { initialize } from "../store/alertsCounterStore";
import useUser from "../store/userStore";
import { GiClothes } from "react-icons/gi";
import { FaBell, FaUser } from "react-icons/fa";
import { IoCalendarNumberSharp, IoCalendarSharp } from "react-icons/io5";
import { BsCalendar2DateFill, BsPlus } from "react-icons/bs";
import { AiFillProduct } from "react-icons/ai";

import { FaShirt } from "react-icons/fa6";


const NavBar = () => {
  const AlertsCounter: number = useAlertsCounter(
    (state) => state.alertsCounter
  );
  // const setAlertsCounter = useAlertsCounter((state) => state.setAlertsCounter);
  const router = useRouter();
  const user = useUser();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    if (!user._id) {
      console.log("Waiting for user ID to load...");
      return;
    }
    initialize(user._id);
  }, [user._id]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    console.log(user._id);

    router.push(`/pages/user/${key === "1" ? "garment_form" : "outfit_canvas"}`);
    message.info(`יצירת ${key==="1"? "בגד":"לוק"}`);
  };

  const items: MenuProps["items"] = [
    {
      label: (
          <div className="flex items-center text-3xl hover:text-blue-600">
              <span className="text-base ml-2">
                יצירת בגד
              </span>
          </div>
      ),
      key: "1",
    },
    {
      label: (
        <div>
          <div className="flex text-3xl hover:text-blue-600">
            <span className="text-base ml-2">
              יצירת לוק
            </span>
          </div>
        </div>
      ),
      key: "2",
    },
  ];

  return (
    <div className="bg-white left-0 w-full border-t-2 h-[10vh] flex justify-between lg:justify-around items-center shadow-md pr-6 pl-6">
      {/* פרטי משתמש */}
        <div className="flex flex-col items-center text-xl hover:text-blue-600 gap-1 lg:flex-row md:text-3xl" onClick={() => router.push("/pages/user/personal_area")}>
          <FaUser 
            className="text-3xl hover:text-blue-600"
          />
            <span className="text-sm text-center lg:ml-2 md:text-base">
              משתמש
            </span>
        </div>

      {/* גלריה */}
        <div className="flex flex-col items-center text-xl hover:text-blue-600 gap-1 lg:flex-row md:text-3xl" onClick={() => router.push("/pages/user/gallery")}>
          <AiFillProduct
            className="text-3xl hover:text-blue-600"
          />
            <span className="text-sm text-center lg:ml-2 md:text-base">
              גלריה
            </span>
        </div>

      {/* כפץתור הוספה מרכזי */}
      <Dropdown menu={{ items, onClick }} className="md:hidden">
        <a onClick={(e) => e.preventDefault()}>
          <PlusOutlined className="text-2xl bg-blue-600 text-white p-2 rounded-full" />
        </a>
      </Dropdown>

      {/* הוסף בגד */}
      {/* {isLargeScreen && ( */}
          <div
            className="hidden md:flex flex-col items-center text-xl hover:text-blue-600 gap-1 lg:flex-row md:text-3xl"
            onClick={() => router.push("/pages/user/garment_form")}
          >
            <div className="flex flex-row items-center">
            <FaShirt className="text-3xl hover:text-blue-600"/>
            <BsPlus className="text-sm"/>
            </div>
              <span className="text-sm text-center lg:ml-2 md:text-base">
                יצירת בגד
              </span>
          </div>
      {/* )} */}

      {/* צור לבוש */}
      {/* {isLargeScreen && ( */}
        <div
          className="hidden md:flex flex-col items-center text-xl hover:text-blue-600 gap-1 lg:flex-row md:text-3xl"
          onClick={() => router.push("/pages/user/outfit_canvas")}
        >
          <div className="flex flex-row items-center">
          <GiClothes className="text-4xl hover:text-blue-600"/>
            <BsPlus className="text-sm"/>
            </div>
            <span className="text-sm text-center lg:ml-2 md:text-base">
              יצירת לוק
            </span>
        </div>
      {/* )} */}

      {/* לוח שנה   */}
        <div className="flex flex-col items-center text-xl hover:text-blue-600 gap-1 lg:flex-row md:text-3xl" onClick={() => router.push("/pages/user/calendar")}>
        <IoCalendarSharp
            className="text-3xl hover:text-blue-600"
          />
            <span className="text-sm text-center lg:ml-2 md:text-base">
              היסטוריה
            </span>
        </div>

      {/* התראות */}
        <div className="flex flex-col items-center text-xl hover:text-blue-600 gap-1 lg:flex-row md:text-3xl group" onClick={() => router.push("/pages/user/alerts")}>
          <Badge
            size="default"
            color="gold"
            count={AlertsCounter}
            offset={[0, 2]}
          >
            <FaBell 
              className="text-3xl hover:text-blue-600"
            />
          </Badge>
            <span className="text-sm text-center lg:ml-2 md:text-base ">
              התראות
            </span>
        </div>
    </div>
  );
};

export default NavBar;
