"use client";
import {
  BellOutlined,
  CalendarOutlined,
  PlusOutlined,
  ProductOutlined,
  SkinOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, MenuProps, message, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAlertsCounter } from "../store/alertsCunterStore";
import Image from "next/image";
import useUser from "../store/userStore";

const NavBar = () => {
  const AlertsCounter: number = useAlertsCounter(
    (state) => state.alertsCounter
  );
  const setAlertsCounter = useAlertsCounter((state) => state.setAlertsCounter);
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await fetch(`/api/alertRoute/userAlerts/674b74d0dc0ad6b3951e1671`);
        console.log(user._id);
        
        // const response = await fetch(`/api/alertRoute/userAlerts/${user._id}`);
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const unreadCount = data.data.filter(
            (alert: { readen: boolean }) => !alert.readen
          ).length;
          setAlertsCounter(unreadCount);
        } else {
          console.error(
            "Error fetching alerts:",
            data.error || "Invalid response format"
          );
          setAlertsCounter(0); // Default value in case of error
        }
      } catch (error) {
        console.error("Error in initialize:", error);
        setAlertsCounter(0); // Default value in case of error
      }
    };
    initialize();
  }, []);
  const onClick: MenuProps["onClick"] = ({ key }) => {
    router.push(`/pages/${key === "1" ? "add-garment" : "add-outfit"}`);
    message.info(`Click on item ${key}`);
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <Tooltip title="הוסף בגד">
          <div className=" text-3xl hover:text-blue-600">
            <SkinOutlined />
            <PlusOutlined className="text-base" />
          </div>
        </Tooltip>
      ),
      key: "1",
    },
    {
      label: (
        <Tooltip title="צור התאמה">
          <div className="flex text-3xl hover:text-blue-600">
            <SkinOutlined />
            <img
              src="https://img.icons8.com/ios/50/skirt.png"
              className="size-8"
            />
            <PlusOutlined className="text-base" />
          </div>
        </Tooltip>
      ),
      key: "2",
    },
  ];

  return (
    <div className="fixed bottom-0 bg-white left-0 w-full border-t-2 h-[10vh] flex justify-between items-center shadow-md pr-6 pl-6">
      {/* פרטי משתמש */}
      <Tooltip title="פרטי משתמש">
        <UserOutlined
          className="text-3xl hover:text-blue-600"
          onClick={() => router.push("/pages/user-details")}
        />
      </Tooltip>

      {/* גלריה */}
      <Tooltip title="גלריה">
        <ProductOutlined
          className="text-3xl hover:text-blue-600"
          onClick={() => router.push("/pages/gallery")}
        />
      </Tooltip>

      {/* כפץתור הוספה מרכזי */}
      <Dropdown menu={{ items, onClick }} className="md:hidden">
        <a onClick={(e) => e.preventDefault()}>
          <div className="rounded-full mb-16 p-4 border-t-2 bg-white">
            <PlusOutlined className="text-4xl bg-blue-600 text-white p-2 rounded-full" />
          </div>
        </a>
      </Dropdown>

      {/* הוסף בגד */}
      <Tooltip title="הוסף בגד">
        <div
          className="hidden text-3xl hover:text-blue-600 md:flex"
          onClick={() => router.push("/pages/add-garment")}
        >
          <SkinOutlined />
          <PlusOutlined className="text-base" />
        </div>
      </Tooltip>

      {/* צור לבוש */}
      <Tooltip title="צור לבוש">
        <div
          className="hidden text-3xl hover:text-blue-600 md:flex"
          onClick={() => router.push("/pages/add-outfit")}
        >
          <SkinOutlined />
          <Image
            src="https://img.icons8.com/ios/50/skirt.png"
            alt="Skirt Icon"
            // layout="intrinsic"
            className="size-8"
            width={50}
            height={50}
          />
          <PlusOutlined className="text-base" />
        </div>
      </Tooltip>

      {/* לוח שנה   */}
      <Tooltip title="לוח">
        <CalendarOutlined
          className="text-3xl hover:text-blue-600"
          onClick={() => router.push("/pages/calender")}
        />
      </Tooltip>

      {/* התראות */}
      <Tooltip title="התראות">
        <Badge
          size="default"
          color="gold"
          count={AlertsCounter}
          offset={[0, 2]}
        >
          <BellOutlined
            className="text-3xl hover:text-blue-600"
            onClick={() => router.push("/pages/alerts")}
          />
        </Badge>
      </Tooltip>
    </div>
  );
};

export default NavBar;
