"use client";
import {Divider } from "antd";
import useAlertsCounter from "@/app/store/alertsCounterStore";
import useUser from "@/app/store/userStore";
import ConnectionReq from "@/app/components/alerts/ConnectionReq";
import Alert from "@/app/components/alerts/Alert";


const Page = () => {
  const decreaseAlertCounter = useAlertsCounter((state) => state.decrease);
  const user = useUser();

  return (
    <div className="pb-6">
      {/* התראות על מלאי */}
      <div className="p-6 pt-2 h-[30vh]">
        <p className="font-sans text-base pb-2 font-thin">
          התראות
        </p>
        {user._id && <Alert userId={user._id} decreaseAlertCounter={decreaseAlertCounter}/>}
      </div>

      <Divider className="mb-0" />

      {/* בקשות התחברות */}
      <div className="p-6 pt-2 h-[30vh]">
        <p className="font-sans text-base font-thin">
          בקשות התחברות
        </p>
        {user._id && <ConnectionReq userId={user._id} decreaseAlertCounter={decreaseAlertCounter}/>}
      </div>
    </div>
  );
};

export default Page;
