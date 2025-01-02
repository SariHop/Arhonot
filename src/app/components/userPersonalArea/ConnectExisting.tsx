import React, { useState } from "react";
import { createNewConnectionRequest } from "@/app/services/ConnectionsServices";
import { CreateConnectionRequestType } from "@/app/types/IConnectionRequest";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useOriginUser from "@/app/store/originUserStore";
import { BsSendFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

const ConnectExisting = () => {
  const router = useRouter();
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

      if (!creatorId) {
        toast.error("המשתמש הנוכחי לא מזוהה. אנא התחבר מחדש.");
        setIsLoading(false);
        return;
      }

      const connectionRequest: CreateConnectionRequestType = {
        userIdSender: creatorId,
        userIdReciver: "",
        status: "pending",
        readen: false,
        date: new Date(),
        sendersName: creatorUserName,
      };

      // יצירת בקשת חיבור
      const response = await createNewConnectionRequest(connectionRequest, emailInput);
      console.log("Response:", response); // להדפיס את התשובה מהשרת
      if (response?.success ===true){
        setEmailInput("");
      }
    } catch (error) {
      console.error("שגיאה 2 בשליחת הבקשה:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-full py-10 px-5 bg-gray-50">
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
          className="w-full p-4 flex items-center justify-center bg-blue-500 text-white font-semibold text-lg rounded-lg hover:bg-blue-600 disabled:bg-gray-500 transition duration-300"
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

        {/* הודעה למשתמש */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-lg">
            שים לב, בקשות התחברות שנשלחו אליך ממשתמשים אחרים ממתינות לך
            בכרטיסיית{" "}
            <button
              onClick={() => router.push("/pages/user/alerts")} // ניווט בעזרת useRouter
              className="text-blue-500 hover:underline focus:outline-none"
            >
              התראות
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectExisting;
