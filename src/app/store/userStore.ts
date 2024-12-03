import { create } from "zustand";
import { UpdateUserTypeForStore, IUserTypeWithId } from "../types/IUser";
// import { Schema } from "mongoose";
import mongoose from "mongoose";
import { persist } from "zustand/middleware";

type UserStore = {
  _id: string | null;
  userName: string;
  password: string;
  email: string;
  age: number;
  gender: string;
  city: string;
  dateOfBirth: Date | null;
  sensitive: string;
  children: mongoose.Types.ObjectId[]; // שימוש ב-mongoose.Types.ObjectId
  userDays: mongoose.Types.ObjectId[];
  setUser: (user: Partial<UpdateUserTypeForStore>) => void;
  updateUser: (updatedFields: Partial<IUserTypeWithId>) => void;
  resetUser: () => void;
};

const useUser = create(
  persist<UserStore>(
    (set) => ({
  _id: null,
  userName: "",
  password: "",
  email: "",
  age: 0,
  gender: "",
  city: "",
  dateOfBirth: null,
  sensitive: "none",
  children: [],
  userDays: [],

  // פונקציה לאיתחול יוזר חדש
  // setUser: (user) => set(() => ({ ...user })),
  setUser: (user) => {
    console.log("Setting user in store: ", user); // הוספתי פה הדפסה לבדוק

    set(() => {
      const newState = {
        _id: user._id ?? null,
        userName: user.userName || "",
        password: user.password || "",
        email: user.email || "",
        age: user.age ?? 0,
        gender: user.gender || "",
        city: user.city || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
        sensitive: user.sensitive || "none",
        children: user.children ?? [],
        userDays: user.userDays ?? [],
      };
      console.log("Updated user:", newState);
      return newState;
    });
  },

  // פונקציה לעדכון שדות יוזר קיימים
  updateUser: (updatedFields) =>
    set((state) => ({
      ...state,
      ...updatedFields,
      dateOfBirth: updatedFields.dateOfBirth
        ? new Date(updatedFields.dateOfBirth)
        : state.dateOfBirth,
    })),

  // פונקציה לאיפוס היוזר לערכים ריקים
  resetUser: () =>
    set({
      _id: null,
      userName: "",
      email: "",
      age: 0,
      gender: "",
      city: "",
      dateOfBirth: null,
      sensitive: "none",
      children: [],
      userDays: [],
    }),
  }),
  {
    name: "user", // שם המפתח לשמירה ב-localStorage
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
export default useUser;
