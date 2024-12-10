"use client";
import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import {SettingOutlined, LogoutOutlined, PlusOutlined, LinkOutlined, DisconnectOutlined, SwapOutlined, CloseOutlined,} from "@ant-design/icons";
import useUser from "@/app/store/userStore";
import Settings from "@/app/components/userPersonalArea/Settings";
import Logout from "@/app/components/userPersonalArea/Logout";

const PersonalArea = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const { userName } = useUser();

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
      default:
        return null;
    }
  };

  return (
    <div
      className="flex h-screen w-screen"
      style={{ paddingTop: "10vh", paddingBottom: "10vh" }} // מרווחים בחלק העליון והתחתון
    >
      {/* תפריט */}
      <div
        className={`transition-all duration-500 bg-gray-50 shadow-xl z-10 overflow-y-auto flex flex-col items-center p-6
          ${isMobile && activeKey ? "translate-x-full w-0" : "w-1/2"}`}
      >
        {userName && (
          <h1 className="text-xl font-bold mb-6 text-center">
            שלום {userName}
          </h1>
        )}
        {[
          { key: "settings", icon: <SettingOutlined />, label: "הגדרות" },
          { key: "logout", icon: <LogoutOutlined />, label: "התנתקות" },
          { key: "create_sub_account", icon: <PlusOutlined />, label: "חשבון בן חדש" },
          { key: "connect_existing", icon: <LinkOutlined />, label: "התחברות לחשבון קיים" },
          { key: "disconnect_account", icon: <DisconnectOutlined />, label: "ניתוק חשבון מקושר" },
          { key: "switch_accounts", icon: <SwapOutlined />, label: "מעבר בין חשבונות" },
        ].map(({ key, icon, label }) => (
          <Tooltip
            title={isMobile ? label : ""}
            key={key}
            placement="right"
            className="w-full"
          >
            <Button
              className={`w-4/5 mb-3 flex items-center justify-center sm:justify-start ${
                activeKey === key ? "bg-blue-500 text-white" : ""
              }`}
              icon={icon}
              onClick={() => handleTogglePanel(key)}
            >
              {!isMobile && <span className="hidden sm:inline">{label}</span>}
            </Button>
          </Tooltip>
        ))}
      </div>

      {/* תוכן הקומפוננטה */}
      <div
        className={`transition-all duration-500 bg-white shadow-inner p-6 flex-1 ${
          isMobile && activeKey ? "w-full" : "w-1/2"
        }`}
      >
        {activeKey && (
          <>
            {isMobile && (
              <Button
                type="primary"
                shape="circle"
                icon={<CloseOutlined />}
                onClick={() => handleTogglePanel(null)}
                className="absolute top-4 left-4"
              />
            )}
            {renderContent()}
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalArea;