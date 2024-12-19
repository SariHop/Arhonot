import React, { useState } from "react";
import { createNewConnectionRequest } from "@/app/services/ConnectionsServices";
import { CreateConnectionRequest } from "@/app/types/IConnectionRequest";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useOriginUser from "@/app/store/originUserStore";
import { getUserByEmail } from "@/app/services/userServices";
import { BsSendFill } from "react-icons/bs";
const ConnectExisting = () => {
  const {
    _id: creatorId,
    email: creatorEmail,
    userName: creatorUserName,
  } = useOriginUser.getState();
  console.log(creatorId, "creatorId", creatorEmail, "creatorEmail");

  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // לטעינה בזמן בדיקת מייל

  const handleEmailSearch = async () => {
    try {
      setIsLoading(true);
      const user = await getUserByEmail(emailInput);
      if (!user) {
        toast.error("לא נמצא משתמש עם כתובת המייל שהוזנה");
        setIsLoading(false);
        return user;
      }

      console.log("User found:", user);

      if (!user._id) {
        toast.error("המשתמש שנמצא לא תקין. חסר מזהה ייחודי (_id).");
        setIsLoading(false);
        return;
      }

      if (!creatorId) {
        toast.error("המשתמש הנוכחי לא מזוהה. אנא התחבר מחדש.");
        setIsLoading(false);
        return;
      }

      const connectionRequest: CreateConnectionRequest = {
        userIdSender: creatorId,
        userIdReciver: user._id,
        status: "pending",
        readen: false,
        date: new Date(),
        sendersName: creatorUserName,
      };

      // יצירת בקשת חיבור
      const response = await createNewConnectionRequest(connectionRequest);
      if (response?.success) {
        toast.success("בקשת החיבור נשלחה בהצלחה!");
      } else {
        toast.error("שגיאה בשליחת בקשת החיבור");
      }
    } catch (error) {
      console.error("שגיאה בשליחת הבקשה:", error);
      toast.error("שגיאה בשליחת בקשת החיבור");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 px-5 bg-gray-50">
      {/* כותרת */}
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{`שליחת בקשת חיבור`}</h2>

      {/* שדה המייל */}
      <div className="w-full max-w-md mb-6">
        <input
          type="email"
          placeholder="הזן כתובת מייל"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="w-full p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg mb-4 placeholder:italic"
        />

        <button
          onClick={handleEmailSearch}
          disabled={isLoading || !emailInput}
          className="w-full p-4 flex items-center justify-center bg-blue-500 text-white font-semibold text-lg rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition duration-300"
        >
          {isLoading ? (
            <span>מחפש...</span>
          ) : (
            <span className="flex items-center">
              שלח בקשה
              <BsSendFill className="mr-2 rotate-180" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConnectExisting;
