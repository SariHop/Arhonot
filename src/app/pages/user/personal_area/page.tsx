"use client";
import React, { useEffect, useState } from "react";
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
  const { _id: currentUserId, userName: currentUser } = useUser();
  const { _id: originUserId, userName: originUser } = useOriginUser();
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 420;
  const isiPad = typeof window !== "undefined" && window.innerWidth > 420 && window.innerWidth < 730;

  const [currentId, setcurrentId] = useState<string | null>(
    currentUserId ? currentUserId.toString() : null
  );
  const [originId, setOriginId] = useState<string | null>(
    originUserId ? originUserId.toString() : null
  );

  useEffect(()=>{
    setOriginId(originUserId?.toString() || null);
    setcurrentId(currentUserId?.toString() || null);
  },[originUserId, currentUserId]);

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
        return <SwitchAccounts setcurrentId={setcurrentId} currentId={currentId} />;
      default:
        return null;
    }
  };

  const menuItemsOriginUser = [
    { key: "settings", icon: <FaCog />, label: "הגדרות" },
    {
      key: "logout",
      icon: <FaSignOutAlt className="rotate-180" />,
      label: "התנתקות",
    },
    { key: "create_sub_account", icon: <FaPlus />, label: "יצירת חשבון מקושר" },
    { key: "connect_existing", icon: <FaLink />, label: "התקשרות לחשבון אחר" },
    {
      key: "disconnect_account",
      icon: <FaUnlink />,
      label: "ניתוק חשבון מקושר",
    },
    {
      key: "switch_accounts",
      icon: <FaExchangeAlt />,
      label: "מעבר בין חשבונות",
    },
  ];

  const menuItemsCurrentUser = [
    {
      key: "logout",
      icon: <FaSignOutAlt className="rotate-180" />,
      label: "התנתקות",
    },
    {
      key: "switch_accounts",
      icon: <FaExchangeAlt />,
      label: "מעבר בין חשבונות",
    },
  ];

  return (
    <div className={`flex h-full justify-self-end ${isMobile || isiPad ? (activeKey ? (isMobile? "w-4/5": "w-5/6") : "w-1/4") : "w-2/3"
    }`}>
      {/* תפריט */}
      <div
        className={`transition-all duration-500 bg-gray-100 shadow-lg overflow-y-hidden flex flex-col h-full items-center px-4 md:px-6 p-4  fixed right-0 z-20 ${
          isMobile || isiPad ? (activeKey ? (isMobile? "w-1/5": "w-1/6") : isMobile? "w-3/4": "w-3/5") : "w-1/3"
        }`}
      >
        {currentUser && originUser && !isMobile && !isiPad && (
          <div>
            <h2 className="mb-1 text-center">שלום {originUser} 😊</h2>
            <h2 className="font-bold text-lg text-center">
              הנך מחובר/ת כ: {currentUser}
            </h2>
          </div>
        )}
        <div className="flex flex-col gap-3 w-full">
        {(originId === currentId ? menuItemsOriginUser : menuItemsCurrentUser).map(({ key, icon, label }) => (
          <>
            <button
              key={key}
              onClick={() => handleTogglePanel(key)}
              className={`w-full flex items-center  p-3 rounded-md text-right transition-colors duration-300 ${
                activeKey === key
                  ? "bg-indigo-500 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              <span
                className={`text-2xl ${
                  activeKey && (isMobile || isiPad)
                    ? "flex items-center justify-center w-full"
                    : ""
                }`}
              >
                {icon}
              </span>
              {!(isMobile || isiPad) || !activeKey ? (
                <span className="truncate">{label}</span>
              ) : null}
            </button>
            </>
          ))}
        </div>
      </div>

      {/*  תוכן הקומפוננטה המוצגת כעת*/}
      {/* <div className="flex content-end"> */}
      <div
        className={`transition-all duration-500 bg-white shadow-inner flex-1 relative overflow-auto m-0 w-full `}
          // ${
        //   isMobile && activeKey ? "w-3/4" : "w-2/3"
        // }
        
      >
        {activeKey && (
          <>
            {(isMobile || isiPad) && (
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
      {/* </div> */}
    </div>
  );
};

export default PersonalArea;
