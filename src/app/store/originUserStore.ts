import { create } from "zustand";
import { UpdateUserTypeForStore, IUserTypeWithId } from "../types/IUser";
import { persist } from "zustand/middleware";
import { Types } from "mongoose";

type OriginUserStore = {
  _id: Types.ObjectId | null;
  userName: string;
  email: string;
  children: Types.ObjectId[];
  setOriginUser: (user: Partial<UpdateUserTypeForStore>) => void;
  updateOriginUser: (updatedFields: Partial<IUserTypeWithId>) => void;
  resetOriginUser: () => void;
};

const useOriginUser = create(
  persist<OriginUserStore>(
    (set) => ({
  _id: null,
  userName: "",
  email: "",
  children: [],

  // פונקציה לאיתחול יוזר חדש
  setOriginUser: (user) => {
    console.log("Setting origin user in store: ", user); 

    set(() => {
      const newState = {
        _id: user._id && Types.ObjectId.isValid(user._id) ? new Types.ObjectId(user._id) : null,
        userName: user.userName || "",
        email: user.email || "",
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
      _id: updatedFields._id && Types.ObjectId.isValid(updatedFields._id)
      ? new Types.ObjectId(updatedFields._id)
      : state._id,
    })),

  // פונקציה לאיפוס היוזר לערכים ריקים
  resetOriginUser: () =>
    set({
      _id: null,
      userName: "",
      email: "",
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
