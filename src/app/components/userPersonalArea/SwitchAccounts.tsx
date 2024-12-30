"use client";
import React, { useEffect, useState } from "react";
import { switchAccount } from "@/app/services/userServices";
import useOriginUser from "@/app/store/originUserStore";
import useUser from "@/app/store/userStore";
import { getUser } from "@/app/services/userServices";
import "react-toastify/dist/ReactToastify.css";
import { UpdateUserTypeForStore } from "@/app/types/IUser";
import { PiUserCircleDuotone } from "react-icons/pi";

const SwitchAccounts = () => {
  const { _id: senderId, userName: originUserName} = useOriginUser();
  const { _id: currentId } = useUser();

  const [children, setChildren] = useState<UpdateUserTypeForStore[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [originEqualsCurrentUser, setOriginEqualsCurrentUser] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [localCurrentId, setLocalCurrentId] = useState<string | null>(
    currentId ? currentId.toString() : null
  );

  // שליפת פרטי המשתמש והילדים
  useEffect(() => {
    const fetchUserData = async () => {
      if (!senderId) return;
      try {
        const response = await getUser(senderId);
        if (response?.success) {
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

  // בדיקה אם המשתמש הנוכחי הוא המשתמש המקורי
  useEffect(() => {
    setOriginEqualsCurrentUser(senderId === localCurrentId )
  }, [senderId, localCurrentId ])

  const handleUserClick = (receiverId: string) => {
    setSelectedUser(receiverId);
    setConfirmDialog(true);
  };

  const handleSwitchAccount = async (receiverId: string | null) => {
    if (!senderId || !receiverId || isSwitching) return;

    setIsSwitching(true);

    try {
      const response = await switchAccount(senderId, receiverId);
      if (response?.success) {
        console.log("החלפת חשבון בהצלחה");
        setLocalCurrentId(receiverId); 
      } else {
        console.error("תקלה בהחלפת חשבון");
      }
    } catch (error) {
      console.error("שגיאה בהחלפת חשבון:", error);
    } finally {
      setConfirmDialog(false);
      setIsSwitching(false);
    }
  };

  const handleCancelDialog = () => {
    setSelectedUser(null);
    setConfirmDialog(false);
  };

  const handleSwitchToOriginUser = () => {
    if (!senderId) return;
    setSelectedUser(senderId.toString())
    setConfirmDialog(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h3 className="text-xl font-bold text-center mb-4">
        החיבורים של {originUserName}
      </h3>
      {!originEqualsCurrentUser && (
        <div className="text-left mb-4">
          <button
            className="bg-indigo-500 text-white font-bold px-4 py-2 rounded hover:bg-indigo-800"
            onClick={handleSwitchToOriginUser}
          >
            חזרה למשתמש מקורי
          </button>
        </div>
      )}
      <ul
        className={`grid gap-4 ${
          children.length > 0 ? "grid-cols-1 sm:grid-cols-2" : ""
        }`}
      >
        {children.map((child) => {
          return (
            <li
              key={child._id as string}
              className={`border p-4 rounded-lg shadow-md ${
                selectedUser === child._id ? "bg-gray-200" : "bg-white"
              } cursor-pointer hover:bg-gray-100`}
              onClick={() => handleUserClick(child._id)}
            >
              <p className="flex justify-between items-center text-lg font-medium">
                {child.userName}
                <span className="ml-2 text-gray-500">
                  <PiUserCircleDuotone className="w-6 h-6" />
                </span>
              </p>
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
          onClick={handleCancelDialog}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-center">
              האם לעבור לחשבון של {}
              <strong>
                {selectedUser?.toString()=== senderId?.toString()
                  ? originUserName // שם המשתמש המקורי
                  : children.find((child) => child._id === selectedUser)
                      ?.userName}
              </strong>
              ?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-indigo-500 text-white font-bold ml-4 px-4 py-2 rounded hover:bg-indigo-800"
                onClick={() => handleSwitchAccount(selectedUser)} // עטיפה של הקריאה
              >
                V
              </button>
              <button
                className="bg-gray-300 text-black font-bold px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleCancelDialog}
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwitchAccounts;


