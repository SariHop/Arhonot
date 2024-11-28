import { create } from 'zustand';
import { IUserTypeWithId } from '../types/IUser';


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
  children: string[];
  userDays: string[];
  setUser: (user: Partial<IUserTypeWithId>) => void;
  updateUser: (updatedFields: Partial<IUserTypeWithId>) => void;
  resetUser: () => void;
}

const useUser = create<UserStore>((set) => ({
  _id: null,
  userName: '',
  password: '',
  email: '',
  age: 0,
  gender: '',
  city: '',
  dateOfBirth: null,
  sensitive: 'none',
  children: [],
  userDays: [],
  
  // פונקציה לאיתחול יוזר חדש
  setUser: (user) =>
    set({
      ...user,
      _id: user._id ?? null,
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
    }),

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
      userName: '',
      email: '',
      age: 0,
      gender: '',
      city: '',
      dateOfBirth: null,
      sensitive: 'none',
      children: [],
      userDays: [],
    }),
}));

export default useUser;
