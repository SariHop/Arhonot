import { create } from "zustand";
import { UpdateUserTypeForStore, IUserTypeWithId } from "../types/IUser";
import { persist } from "zustand/middleware";
import { Types } from "mongoose";

type OriginUserStore = {
  _id: string;
  userName: string;
  children: Types.ObjectId[];
  setOriginUser: (user: Partial<UpdateUserTypeForStore>) => void;
  updateOriginUser: (updatedFields: Partial<IUserTypeWithId>) => void;
  resetOriginUser: () => void;
};

const useOriginUser = create(
  persist<OriginUserStore>(
    (set) => ({
  _id: "",
  userName: "",
  children: [],

  // פונקציה לאיתחול יוזר חדש
  setOriginUser: (user) => {
    console.log("Setting origin user in store: ", user); // הוספתי פה הדפסה לבדוק

    set(() => {
      const newState = {
        _id: user._id ?? "",
        userName: user.userName || "",
        children: user.children ?? [],
      };
      console.log("Updated origin user:", newState);
      return newState;
    });
  },

  // פונקציה לעדכון שדות יוזר קיימים
  updateOriginUser: (updatedFields) =>
    set((state) => ({
      ...state,
      ...updatedFields,
    })),

  // פונקציה לאיפוס היוזר לערכים ריקים
  resetOriginUser: () =>
    set({
      _id: "",
      userName: "",
      children: [],
    }),
  }),
  {
    name: "originUser", // שם המפתח לשמירה ב-localStorage
    storage: {
      getItem: (name) => {
        const storedValue = localStorage.getItem(name);
        return storedValue ? JSON.parse(storedValue) : null;
      },
      setItem: (name, value) => {
        localStorage.setItem(name, JSON.stringify(value));
      },
      removeItem: (name) => {
        localStorage.removeItem(name);
      },
    }, 
  }
)
);
export default useOriginUser;
