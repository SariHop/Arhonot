"use client";
import { PlusOutlined } from "@ant-design/icons";
import { Badge, Dropdown, MenuProps, message } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useAlertsCounter, { initialize } from "../store/alertsCounterStore";
import useUser from "../store/userStore";
import { GiClothes } from "react-icons/gi";
import { FaBell, FaUser } from "react-icons/fa";
import { IoCalendarSharp } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import { AiFillProduct } from "react-icons/ai";

import { FaShirt } from "react-icons/fa6";

const NavBar = () => {
  const [selectedPage, setSelectedPage] = useState(""); // שומר את הקטגוריה שנבחרה
  const AlertsCounter: number = useAlertsCounter(
    (state) => state.alertsCounter
  );
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();

  useEffect(() => {
    if (!user._id) {
      console.log("Waiting for user ID to load...");
      return;
    }
    initialize(user._id);

    // קביעת הדף הנוכחי
    const currentPath = pathname.split("/").pop();
    setSelectedPage(currentPath || "");
  }, [user._id, pathname]);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsLargeScreen(window.innerWidth >= 1024);
  //   };

  //   window.addEventListener('resize', handleResize);
  //   handleResize(); // initial check

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  const handleClick = (key: string) => {
    router.push(`/pages/user/${key}`);
    // setSelectedPage(key); 
  };

  const onClick: MenuProps["onClick"] = ({ key }) => {
    console.log(user._id);

    router.push(
      `/pages/user/${key === "1" ? "garment_form" : "outfit_canvas"}`
    );
    message.info(`יצירת ${key === "1" ? "בגד" : "לוק"}`);
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <div className="flex items-center text-3xl hover:text-blue-600">
          <span className="text-base ml-2">יצירת בגד</span>
        </div>
      ),
      key: "1",
    },
    {
      label: (
        <div>
          <div className="flex text-3xl hover:text-blue-600">
            <span className="text-base ml-2">יצירת לוק</span>
          </div>
        </div>
      ),
      key: "2",
    },
  ];

  return (
    <div className="bg-white left-0 w-full h-[10vh] flex justify-around lg:justify-around items-center border-t-2 border-blue-600 lg:border-none">
     
      {/* פרטי משתמש */}
      <div
        className={`cursor-pointer flex flex-col items-center justify-center  w-full h-full hover:border-t-2 hover:border-t-blue-600 hover:text-blue-600 text-xl gap-1 lg:flex-row md:text-3xl
           ${selectedPage === "personal_area" ? "border-t-blue-600 border-t-2 text-blue-600" : ""}`}
        onClick={() => handleClick("personal_area")}
      >
        <FaUser className="text-2xl" />
        <span className="text-xs text-center lg:ml-2 md:text-base">משתמש</span>
      </div>

      {/* גלריה */}
      <div
        className={`cursor-pointer flex flex-col items-center justify-center  w-full h-full hover:border-t-2 hover:border-t-blue-600 hover:text-blue-600 text-xl gap-1 lg:flex-row md:text-3xl
           ${selectedPage === "gallery" ? "border-t-blue-600 border-t-2 text-blue-600" : ""
          }`}
        onClick={() => handleClick("gallery")}
      >
        <AiFillProduct className="text-2xl" />
        <span className="text-xs text-center lg:ml-2 md:text-base">גלריה</span>
      </div>

      {/* כפץתור הוספה מרכזי */}
      <Dropdown menu={{ items, onClick }} className="md:hidden cursor-pointer">
        <a onClick={(e) => e.preventDefault()}>
          <PlusOutlined className="text-2xl bg-blue-600 text-white p-2 rounded-full" />
        </a>
      </Dropdown>

      {/* הוסף בגד */}
      {/* {isLargeScreen && ( */}
      <div
        className={`cursor-pointer hidden md:flex flex-col items-center justify-center  w-full h-full hover:border-t-2 hover:border-t-blue-600 hover:text-blue-600 text-xl gap-1 lg:flex-row md:text-3xl
           ${selectedPage === "garment_form" ? "border-t-blue-600 border-t-2 text-blue-600" : ""
          }`}
        onClick={() => handleClick("garment_form")}
      >
        <div className="flex flex-row items-center">
          <FaShirt className="text-2xl" />
          <BsPlus className="text-sm" />
        </div>
        <span className="text-xs text-center lg:ml-2 md:text-base">
          יצירת בגד
        </span>
      </div>
      {/* )} */}

      {/* צור לבוש */}
      {/* {isLargeScreen && ( */}
      <div
        className={`cursor-pointer hidden md:flex flex-col items-center justify-center  w-full h-full hover:border-t-2 hover:border-t-blue-600 hover:text-blue-600 text-xl  gap-1 lg:flex-row md:text-3xl 
          ${selectedPage === "outfit_canvas" ? "border-t-blue-600 border-t-2 text-blue-600" : ""
          }`}
        onClick={() => handleClick("outfit_canvas")}
      >
        <div className="flex flex-row items-center">
          <GiClothes className="text-2xl hover:text-blue-600" />
          <BsPlus className="text-sm" />
        </div>
        <span className="text-xs text-center lg:ml-2 md:text-base">
          יצירת לוק
        </span>
      </div>
      {/* )} */}

      {/* לוח שנה   */}
      <div
        className={`cursor-pointer flex flex-col items-center justify-center  w-full h-full hover:border-t-2 hover:border-t-blue-600 hover:text-blue-600  text-xl gap-1 lg:flex-row md:text-3xl 
          ${selectedPage === "calendar" ? "border-t-blue-600 border-t-2 text-blue-600" : ""
          }`}
        onClick={() => handleClick("calendar")}
      >
        <IoCalendarSharp className="text-3xl" />
        <span className="text-xs text-center lg:ml-2 md:text-base">
          היסטוריה
        </span>
      </div>

      {/* התראות */}
      <div
        className={`cursor-pointer flex flex-col items-center justify-center  w-full h-full hover:border-t-2 hover:border-t-blue-600 hover:text-blue-600 text-xl gap-1 lg:flex-row md:text-3xl group
           ${selectedPage === "alerts" ? "border-t-blue-600 border-t-2 text-blue-600" : ""
          }`}
        onClick={() => handleClick("alerts")}
      >
        <Badge
          size="default"
          color="gold"
          count={AlertsCounter}
          offset={[0, 2]}
        >
          <FaBell className="text-2xl" />
        </Badge>
        <span className="text-xs text-center lg:ml-2 md:text-base ">
          התראות
        </span>
      </div>
    </div>
  );
};

export default NavBar;
