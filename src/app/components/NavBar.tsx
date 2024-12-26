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
import React, { useEffect, useState } from "react";
import useAlertsCounter, { initialize } from "../store/alertsCounterStore";
import Image from "next/image";
import useUser from "../store/userStore";

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
    message.info(`Click on item ${key}`);
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <Tooltip title="הוסף בגד">
          <div className="flex items-center text-3xl hover:text-blue-600">
            {/* Icon */}
            <SkinOutlined />
            <PlusOutlined className="text-base" />

            {/* Text */}
            {isLargeScreen && (
              <span className="text-base ml-2">
                הוסף בגד
              </span>
            )}
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
          {isLargeScreen && (
            <span className="text-base ml-2">
              צור התאמה
            </span>
          )}
        </Tooltip>
      ),
      key: "2",
    },
  ];

  return (
    <div className="bg-white left-0 w-full border-t-2 h-[10vh] flex justify-between lg:justify-around items-center shadow-md pr-6 pl-6">
      {/* פרטי משתמש */}
      <Tooltip title="פרטי משתמש">
        <div>
          <UserOutlined
            className="text-3xl hover:text-blue-600"
            onClick={() => router.push("/pages/user/personal_area")}
          />
          {isLargeScreen && (
            <span className="text-base ml-2">
              פרטי משתמש
            </span>
          )}
        </div>
      </Tooltip>

      {/* גלריה */}
      <Tooltip title="גלריה">
        <div>
          <ProductOutlined
            className="text-3xl hover:text-blue-600"
            onClick={() => router.push("/pages/user/gallery")}
          />
          {isLargeScreen && (
            <span className="text-base ml-2">
              גלריה
            </span>
          )}
        </div>
      </Tooltip>

      {/* כפץתור הוספה מרכזי */}
      <Dropdown menu={{ items, onClick }} className="md:hidden">
        <a onClick={(e) => e.preventDefault()}>
          <PlusOutlined className="text-2xl bg-blue-600 text-white p-2 rounded-full" />

        </a>
      </Dropdown>

      {/* הוסף בגד */}
      {isLargeScreen && (
        <Tooltip title="הוסף בגד">
          <div
            className="flex items-center text-3xl hover:text-blue-600 gap-2"
            onClick={() => router.push("/pages/user/garment_form")}
          >
            <SkinOutlined />
            <PlusOutlined className="text-base" />
          </div>
          {isLargeScreen && (
            <span className="text-base ml-2">
              הוסף בגד
            </span>
          )}
        </Tooltip>
      )}

      {/* צור לבוש */}
      {isLargeScreen && (<Tooltip title="צור לבוש">
        <div
          className="flex items-center text-3xl hover:text-blue-600 gap-2"
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
        {isLargeScreen && (
          <span className="text-base ml-2">
            צור לבוש
          </span>
        )}
      </Tooltip>
      )}

      {/* לוח שנה   */}
      <Tooltip title="לוח">
        <div>
          <CalendarOutlined
            className="text-3xl hover:text-blue-600"
            onClick={() => router.push("/pages/user/calendar")}
          />
          {isLargeScreen && (
            <span className="text-base ml-2">
              לוח שנה
            </span>
          )}
        </div>
      </Tooltip>

      {/* התראות */}
      <Tooltip title="התראות">
        <div>
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
          {isLargeScreen && (
            <span className="text-base ml-2">
              התראות
            </span>
          )}
        </div>
      </Tooltip>
    </div>
  );
};

export default NavBar;
