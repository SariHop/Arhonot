import { create } from "zustand";
import { UpdateUserTypeForStore, IUserTypeWithId } from "../types/IUser";
import { persist } from "zustand/middleware";
import { Types } from "mongoose";

type UserStore = {
  _id: string;
  userName: string;
  password: string;
  email: string;
  age: number;
  gender: string;
  city: string;
  dateOfBirth: Date | null;
  sensitive: string;
  children: Types.ObjectId[]; // שינה מ-string[] ל-ObjectId[]
  setUser: (user: Partial<UpdateUserTypeForStore>) => void;
  updateUser: (updatedFields: Partial<IUserTypeWithId>) => void;
  resetUser: () => void;
};

const useUser = create(
  persist<UserStore>(
    (set) => ({
  _id: "",
  userName: "",
  password: "",//למחוק את שמירת הסיסמא
  email: "",
  age: 0,
  gender: "",
  city: "",
  dateOfBirth: null,
  sensitive: "none",
  children: [],

  // פונקציה לאיתחול יוזר חדש
  // setUser: (user) => set(() => ({ ...user })),
  setUser: (user) => {
    console.log("Setting user in store: ", user); // הוספתי פה הדפסה לבדוק

    set(() => {
      const newState = {
        _id: user._id ?? "",
        userName: user.userName || "",
        password: user.password || "",//למחוק לאחר הסרת מהסטור
        email: user.email || "",
        age: user.age ?? 0,
        gender: user.gender || "",
        city: user.city || "",
        dateOfBirth: user.dateOfBirth 
        ? (user.dateOfBirth instanceof Date 
            ? user.dateOfBirth 
            : new Date(user.dateOfBirth))
        : null,
        sensitive: user.sensitive || "none",
        children: user.children ?? [],
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
      _id: "",
      password:"",// למחוק לאחר הסרת שמירת הסיסמא בסטור
      userName: "",
      email: "",
      age: 0,
      gender: "",
      city: "",
      dateOfBirth: null,
      sensitive: "none",
      children: [],
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
