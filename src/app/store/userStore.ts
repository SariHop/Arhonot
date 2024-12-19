import { create } from "zustand";
import { UpdateUserTypeForStore, IUserTypeWithId } from "../types/IUser";
import { persist } from "zustand/middleware";
import { Types } from "mongoose";

type UserStore = {
  _id: Types.ObjectId | null;
  userName: string;
  email: string;
  age: number;
  gender: string;
  city: string;
  dateOfBirth: Date | null;
  sensitive: string;
  children: Types.ObjectId[];
  setUser: (user: Partial<UpdateUserTypeForStore>) => void;
  updateUser: (updatedFields: Partial<IUserTypeWithId>) => void;
  resetUser: () => void;
};

const useUser = create(
  persist<UserStore>(
    (set) => ({
  _id: null,
  userName: "",
  email: "",
  age: 0,
  gender: "",
  city: "",
  dateOfBirth: null,
  sensitive: "none",
  children: [],

  // פונקציה לאיתחול יוזר חדש
  setUser: (user) => {
    console.log("Setting user in store: ", user); 

    set(() => {
      const newState = {
        _id: user._id && Types.ObjectId.isValid(user._id) ? new Types.ObjectId(user._id) : null,
        userName: user.userName || "",
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
      _id: updatedFields._id && Types.ObjectId.isValid(updatedFields._id)
      ? new Types.ObjectId(updatedFields._id)
      : state._id,
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
