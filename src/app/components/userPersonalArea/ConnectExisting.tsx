import React, { useState } from "react";
import { createNewConnectionRequest } from "@/app/services/ConnectionsServices";
import { IConnectionRequest2 } from "@/app/types/IConnectionRequest";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useOriginUser from "@/app/store/originUserStore";
// import { Schema } from "mongoose";
import {getUserByEmail} from '@/app/services/userServices'

const ConnectExisting = () => {
  const {
    _id: creatorId,
    email: creatorEmail,
    userName: creatorUserName,
  } = useOriginUser.getState();
  console.log(creatorId, "creatorId", creatorEmail, "creatorEmail");
  // const sender = new Schema.Types.ObjectId(creatorId);

  const [emailInput, setEmailInput] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); // לטעינה בזמן בדיקת מייל

  const handleEmailSearch = async () => {
    try {
      setIsLoading(true);
      const user = await getUserByEmail(emailInput); 
      if (!user) {
        toast.error("לא נמצא משתמש עם כתובת המייל שהוזנה");
        setIsLoading(false);
        return;
      }

      // const reciver = new Schema.Types.ObjectId(user._id);
      
      const connectionRequest: IConnectionRequest2 = {
        userIdSender: creatorId,
        userIdReciver: user._id,
        status: "pending",
        readen: false,
        date: new Date(),
        sendersName: creatorUserName,
      };
// יצירת בקשת חיבור
      await createNewConnectionRequest(connectionRequest); 
      toast.success("בקשת החיבור נשלחה בהצלחה!");
    } catch (error) {
      console.error("שגיאה בשליחת הבקשה:", error);
      toast.error("שגיאה בשליחת בקשת החיבור");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>שליחת בקשת חיבור</h2>
      <input
        type="email"
        placeholder="הזן כתובת מייל"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
      />
      <button onClick={handleEmailSearch} disabled={isLoading || !emailInput}>
        {isLoading ? "מחפש..." : "שלח בקשה"}
      </button>
    </div>
  );
};

export default ConnectExisting;
