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
import { initialize, useAlertsCounter } from "../store/alertsCounterStore";
import Image from "next/image";
import useUser from "../store/userStore";

const NavBar = () => {
  const AlertsCounter: number = useAlertsCounter(
    (state) => state.alertsCounter
  );
  // const setAlertsCounter = useAlertsCounter((state) => state.setAlertsCounter);
  const router = useRouter();
  const user = useUser((state) => state);

  useEffect(() => {
    
    initialize(user._id);
  }, []);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    console.log(user._id);
    
    router.push(`/pages/user/${key === "1" ? "garment_form" : "outfit_canvas"}`);
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
    <div className="  bg-white left-0 w-full border-t-2 h-[10vh] flex justify-between items-center shadow-md pr-6 pl-6">
      {/* פרטי משתמש */}
      <Tooltip title="פרטי משתמש">
        <UserOutlined
          className="text-3xl hover:text-blue-600"
          onClick={() => router.push("/pages/user/personal_area")}
        />
      </Tooltip>

      {/* גלריה */}
      <Tooltip title="גלריה">
        <ProductOutlined
          className="text-3xl hover:text-blue-600"
          onClick={() => router.push("/pages/user/gallery")}
        />
      </Tooltip>

      {/* כפץתור הוספה מרכזי */}
      <Dropdown menu={{ items, onClick }} className="md:hidden">
        <a onClick={(e) => e.preventDefault()}>
            <PlusOutlined className="text-2xl bg-blue-600 text-white p-2 rounded-full" />

        </a>
      </Dropdown>

      {/* הוסף בגד */}
      <Tooltip title="הוסף בגד">
        <div
          className="hidden text-3xl hover:text-blue-600 md:flex"
          onClick={() => router.push("/pages/user/garment_form")}
        >
          <SkinOutlined />
          <PlusOutlined className="text-base" />
        </div>
      </Tooltip>

      {/* צור לבוש */}
      <Tooltip title="צור לבוש">
        <div
          className="hidden text-3xl hover:text-blue-600 md:flex"
          onClick={() => router.push("/pages/user/outfit_canvas")}
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
          onClick={() => router.push("/pages/user/calendar")}
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
            onClick={() => router.push("/pages/user/alerts")}
          />
        </Badge>
      </Tooltip>
    </div>
  );
};

export default NavBar;
