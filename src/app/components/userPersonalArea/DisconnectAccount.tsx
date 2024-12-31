"use client";
import React, { useEffect, useState } from "react";
import useOriginUser from "@/app/store/originUserStore";
import { removeConnectionRequest } from "@/app/services/ConnectionsServices";
import { getUser } from "@/app/services/userServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UpdateUserTypeForStore } from "@/app/types/IUser";

const ConnectionList = () => {
  const { _id: senderId } = useOriginUser();
  const [children, setChildren] = useState<UpdateUserTypeForStore[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);

  // שליפת פרטי המשתמש והילדים
  useEffect(() => {
    console.log("senderId:", senderId);

    const fetchUserData = async () => {
      if (!senderId) return;
      try {
        const response = await getUser(senderId);
        console.log("Response:", response);
        if (response?.success) {
          console.log("Children data from response:", response.data.children); // הדפסת המידע שהתקבל
          setChildren(response.data.children);
        } else {
          console.error("Error fetching user data:", response?.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [senderId]);

  const handleUserClick = (receiverId: string) => {
    setSelectedUser(receiverId);
    setConfirmDialog(true);
  };

  const handleCancelConnection = async () => {
    if (!senderId || !selectedUser) return;
    try {
      await removeConnectionRequest(senderId, selectedUser);
      // if (response?.success) {
        toast.success("החיבור הוסר בהצלחה");
        setChildren((prevChildren) =>
          prevChildren.filter((child) => child._id !== selectedUser)
        ); // עדכון הרשימה לאחר הסרה
      // } else {
      //   toast.error("שגיאה בהסרת החיבור");
      // }
    } catch (error) {
      console.log("error deleting the connection: ", error);
    } finally {
      setConfirmDialog(false);
      setSelectedUser(null);
    }
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
          console.log("Rendering child:", child);
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
                גיל: {child.age}, עיר: {child.city}
              </p>
              <p className="text-sm text-gray-500"> {child.email}</p>
            </li>
          );
        })}
      </ul>

      {confirmDialog && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          onClick={handleCancelDialog} // הוספת מאזין ללחיצה על הרקע
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-center">
              האם אתה רוצה לבטל את החיבור שלך למשתמש{" "}
              <strong>
                {children.find((child) => child._id === selectedUser)?.userName}
              </strong>
              ?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-indigo-500 text-white font-bold ml-4 px-4 py-2 rounded hover:bg-indigo-800"
                onClick={handleCancelConnection}
              >
                כן
              </button>
              <button
                className="bg-gray-300 text-black font-bold px-4 py-2 rounded hover:bg-gray-400"
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
