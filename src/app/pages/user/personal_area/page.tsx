"use client";
import React, { useState } from "react";
import {
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaLink,
  FaUnlink,
  FaExchangeAlt,
  FaTimes,
} from "react-icons/fa";
import Settings from "@/app/components/userPersonalArea/Settings";
import Logout from "@/app/components/userPersonalArea/Logout";
import CreateSubAccount from "@/app/components/userPersonalArea/CreateSubAccount";
import ConnectExisting from "@/app/components/userPersonalArea/ConnectExisting";
import DisconnectAccount from "@/app/components/userPersonalArea/DisconnectAccount";
import SwitchAccounts from "@/app/components/userPersonalArea/SwitchAccounts";
import useOriginUser from "@/app/store/originUserStore";
import useUser from "@/app/store/userStore";

const PersonalArea = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const { /*_id: currentId,*/ userName: currentUser } = useUser();
  const { /*_id: originId,*/ userName: originUser } = useOriginUser();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const handleTogglePanel = (key: string | null) => {
    setActiveKey(key);
  };

  const renderContent = () => {
    switch (activeKey) {
      case "settings":
        return <Settings />;
      case "logout":
        return <Logout />;
      case "create_sub_account":
        return <CreateSubAccount />;
      case "connect_existing":
        return <ConnectExisting />;
      case "disconnect_account":
        return <DisconnectAccount />;
      case "switch_accounts":
        return <SwitchAccounts />;
      default:
        return null;
    }
  };

  const menuItems = [
    { key: "settings", icon: <FaCog />, label: "הגדרות" },
    { key: "logout",icon: <FaSignOutAlt className="rotate-180" />, label: "התנתקות"},
    { key: "create_sub_account", icon: <FaPlus />, label: "יצירת חשבון מקושר" },
    { key: "connect_existing", icon: <FaLink />, label: "התקשרות לחשבון אחר" },
    { key: "disconnect_account", icon: <FaUnlink />, label: "ניתוק חשבון מקושר" },
    { key: "switch_accounts", icon: <FaExchangeAlt />, label: "מעבר בין חשבונות" },
  ];
  

  // const filteredMenuItems =
  //  currentId === originId
  //     ? menuItems
  //     : menuItems.filter(
  //         ({ key }) =>
  //           ![
  //             "settings",
  //             "create_sub_account",
  //             "connect_existing",
  //             "disconnect_account",
  //           ].includes(key)
  //       );

        

  return (
    <div className="flex h-full w-screen">
      {/* תפריט */}
      <div
        className={`transition-all duration-500 bg-gray-100 shadow-lg overflow-y-auto flex flex-col items-center p-6 ${
          isMobile ? (activeKey ? "w-2/9" : "w-3/4") : "w-1/3"
        }`}
      >
        {currentUser && originUser && !isMobile && (
          <div>
            <h2 className="mb-1 text-center">שלום {originUser} 😊</h2>
            <h2 className="font-bold text-lg text-center">
              הנך מחובר/ת כ: {currentUser}
            </h2>
          </div>
        )}
        <div className="flex flex-col gap-3 w-full">
          {menuItems.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => handleTogglePanel(key)}
              className={`w-full flex items-center gap-3 p-3 rounded-md text-right transition-colors duration-300 ${
                activeKey === key
                  ? "bg-indigo-500 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              <span
                className={`text-2xl ${
                  activeKey === key && isMobile
                    ? "flex items-center justify-center w-full"
                    : ""
                }`}
              >
                {icon}
              </span>
              {!isMobile || !activeKey ? (
                <span className="truncate">{label}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/*  תוכן הקומפוננטה המוצגת כעת*/}
      <div
        className={`transition-all duration-500 bg-white shadow-inner flex-1 relative ${
          isMobile && activeKey ? "w-full" : "w-1/2"
        }`}
      >
        {activeKey && (
          <>
            {isMobile && (
              <button
                onClick={() => handleTogglePanel(null)}
                className="absolute left-4 top-4 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300"
              >
                <FaTimes className="text-lg" />
              </button>
            )}
            {renderContent()}
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalArea;
