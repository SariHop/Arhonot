"use client";
import React, { useEffect, useState } from "react";
import useOriginUser from "@/app/store/originUserStore";
import { removeConnectionRequest } from "@/app/services/ConnectionsServices";
import { getUser } from "@/app/services/userServices";
import { Types } from "mongoose";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UpdateUserTypeForStore } from "@/app/types/IUser";

const ConnectionList = () => {
  const { _id: senderId } = useOriginUser(); // שליפת ה־_id של המשתמש המקורי
  const [children, setChildren] = useState<UpdateUserTypeForStore[]>([]); // מצב עבור מערך הילדים
  const [selectedUser, setSelectedUser] = useState<string | null>(null); // לזהות משתמש שנבחר
  const [confirmDialog, setConfirmDialog] = useState(false); // לשלוט בדיאלוג

  // שליפת פרטי המשתמש והילדים
  useEffect(() => {
    console.log("senderId:", senderId); // הדפסת senderId

    const fetchUserData = async () => {
      if (!senderId) return;
      try {
        console.log("Fetching user data for:", senderId); // הדפסת בקשה לשרת

        const response = await getUser(senderId);
        console.log("Response:", response); // הדפסת התגובה מהשרת

        if (response?.success) {
          console.log("Children data from response:", response.data.children); // הדפסת המידע שהתקבל
          setChildren(response.data.children); // שמירת המידע של הילדים במצב
        } else {
          console.error("Error fetching user data:", response?.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [senderId]);

  useEffect(() => {
    console.log("Updated children state:", children); // הדפסת מצב הילדים לאחר עדכון
  }, [children]);

  const handleUserClick = (receiverId: string) => {
    setSelectedUser(receiverId);
    setConfirmDialog(true); // פתיחת דיאלוג האישור
  };

  const handleCancelConnection = async () => {
    if (!senderId || !selectedUser) return;

    const response = await removeConnectionRequest(senderId, selectedUser);
    if (response?.success) {
      toast.success("החיבור הוסר בהצלחה");
      setChildren((prevChildren) =>
        prevChildren.filter((child) => child._id !== selectedUser)
      ); // עדכון הרשימה לאחר הסרה
    } else {
      toast.error("שגיאה בהסרת החיבור");
    }

    setConfirmDialog(false); // סגירת הדיאלוג
    setSelectedUser(null); // איפוס הבחירה
  };

  const handleCancelDialog = () => {
    setConfirmDialog(false);
    setSelectedUser(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h3 className="text-xl font-bold text-center mb-4">החיבורים שלי</h3>
      <ul className="space-y-4">
        {children.map((child) => {
          console.log("Rendering child:", child); // הדפסת כל ילד שמוצג
          return (
            <li
              key={child._id as string}
              className={`border p-4 rounded-lg shadow-md ${
                selectedUser === child._id ? "bg-gray-200" : "bg-white"
              } cursor-pointer hover:bg-gray-100`}
              onClick={() => handleUserClick(child._id)}
            >
              <p className="text-lg font-medium">{child.userName}</p>
              <p className="text-sm text-gray-600">
                גיל: {child.age}, מין: {child.gender}, עיר: {child.city}
              </p>
              <p className="text-sm text-gray-500">דוא"ל: {child.email}</p>
            </li>
          );
        })}
      </ul>

      {confirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4 text-center">
              האם אתה רוצה לבטל את החיבור שלך למשתמש{" "}
              <strong>
                {children.find((child) => child._id === selectedUser)?.userName}
              </strong>
              ?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleCancelConnection}
              >
                כן
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleCancelDialog}
              >
                לא
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionList;
