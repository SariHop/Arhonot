"use client";
import React, { useEffect, useState } from "react";
import { userSchemaZod, IUserType } from "@/app/types/IUser";
import { ZodError } from "zod";
import { signup, createSubAccount } from "@/app/services/userServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { EyeInvisibleTwoTone, EyeTwoTone } from "@ant-design/icons";
import { useCityQuery } from "@/app/hooks/cityQueryHook";
import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { usePathname, useRouter } from "next/navigation"; // ייבוא מתוך next/navigation
import { initialize } from "@/app/store/alertsCounterStore";
import useUser from "../store/userStore";
import { isHandledError } from "../services/errorServices";
import { CircularProgress } from "@mui/material";


const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUser();
  const [formData, setFormData] = useState<IUserType>({
    password: "",
    confirmPassword: "",
    email: "",
    userName: "",
    gender: "זכר",
    dateOfBirth: new Date("10/10/2000"),
    age: 0,
    city: "ירושלים",
    sensitive: "none",
  });
  useEffect(() => {
    if (!user._id) {
      console.log("Waiting for user ID to load...");
      return;
    }
    initialize(user._id);
  }, [user._id]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof IUserType, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: cities, isLoading, error } = useCityQuery();
  const router = useRouter();
  const pathname = usePathname();
  const isSignUpPage = pathname?.endsWith("/signup"); // בודק אם הנתיב מסתיים ב-signup
  const isUserPage = pathname?.endsWith("/user/personal_area"); // בודק אם הנתיב מסתיים ב-personal_area

  const title = isSignUpPage
    ? "הרשמה:"
    : isUserPage
    ? "יצירת חשבון מקושר"
    : "ברוך הבא";

  const buttonSubmit = isSignUpPage
    ? "התחברות:"
    : isUserPage
    ? "יצירת חשבון מקושר"
    : "ברוך הבא";
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const validationResult = await userSchemaZod.parseAsync(formData);
      console.log("הנתונים תקינים:", validationResult);
      setErrors({});

      let result;
      if (isUserPage) {
        result = await createSubAccount(formData);
      } else {
        result = await signup(formData);
      }
      if (
        "status" in result &&
        (result.status === 200 || result.status === 201)
      ) {
        if (result.success) {
          console.log("Signup successful:", result.data);
          toast.success("החשבון נוצר בהצלחה");
          router.push("/pages/user"); // הפניה לעמוד הבית
        } else if (!result.success) {
          console.log("result.success", result.success);
        } else {
          console.log("status is not existing in result");
        }
      } else {
        if ("status" in result && result.status !== undefined) {
          if (result.status === 403) {
            toast.error("אין לך הרשאה לבצע פעולה זו");
          } else if (result.status === 404) {
            toast.error("אימייל זה כבר קיים במערכת,\nנסה אולי התחברות");
          } else if (result.status === 402) {
            toast.error("העיר שנבחרה לא תקינה");
          } else if ("message" in result) {
            toast.error(`ההרשמה נכשלה: \n${result.message}`);
          }
        } else {
          console.log("", result);
          toast.error("שגיאה כללית בעת ההרשמה");
        }

        setIsSubmitting(false);
      }
    } catch (err) {
      if (isHandledError(err)) console.log("שגיאה באימות");
      const fieldErrors: Partial<Record<keyof IUserType, string>> = {};
      if (err instanceof ZodError) {
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as keyof IUserType] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md text-center shadow-md">
          <strong className="font-bold">שגיאה!</strong>
          <span className="block sm:inline mt-2">
            שגיאה בטעינת ערים: {String(error)}
          </span>
        </div>
      </div>
    );

  const cityOptions: DefaultOptionType[] = (cities || []).map(
    (city: string) => ({
      label: city,
      value: city,
    })
  );

  const handleCityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, city: value }));
  };

  return (

    <div
      className={`flex justify-center items-center min-h-full ${
        isUserPage ? "py-10 px-2 bg-gradient-to-br from-green-200 to-blue-300" : " bg-gradient-to-br from-green-200 to-blue-300"
      }`}
    >

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="bg-white p-8 shadow-md rounded-md w-full max-w-md m-5"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* UserName */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="userName"
            >
              שם משתמש
            </label>
            <input
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />

            {errors.userName && (
              <p className="text-red-500 text-sm">{errors.userName}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              אימייל
            </label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Password */}
          <div className="mb-4 relative">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              סיסמא
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {/* Icon */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute left-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeInvisibleTwoTone /> : <EyeTwoTone />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="confirmPassword"
            >
              אימות סיסמא
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {/* Icon */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute left-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeInvisibleTwoTone /> : <EyeTwoTone />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Gender */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="gender"
            >
              מין
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500  h-10"
            >
              <option value="זכר">זכר</option>
              <option value="נקבה">נקבה</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>
          {/* Date of Birth */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 "
              htmlFor="dateOfBirth"
            >
              תאריך לידה
            </label>
            <input
              type="date"
              value={
                formData.dateOfBirth
                  ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                if (e.target.value) {
                  // עדכון הערך רק אם המשתמש מזין תאריך תקין
                  setFormData({
                    ...formData,
                    dateOfBirth: new Date(e.target.value),
                  });
                } else {
                  // החזרת הערך הנוכחי אם מנסים לנקות
                  e.target.value = new Date(formData.dateOfBirth)
                    .toISOString()
                    .split("T")[0];
                }
              }}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500  h-10"
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* City */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="city"
            >
              עיר מגורים
            </label>

            <Select
              id="city"
              showSearch
              onChange={handleCityChange}
              options={cityOptions}
              placeholder="בחר עיר"
              className="w-full mt-1 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 h-10"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
          </div>
          {/* Sensitive */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="sensitive"
            >
              יש רגישות ל:
            </label>
            <select
              id="sensitive"
              name="sensitive"
              value={formData.sensitive}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="none">ללא</option>
              <option value="cold">קור</option>
              <option value="heat">חום</option>
            </select>
            {errors.sensitive && (
              <p className="text-red-500 text-sm">{errors.sensitive}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white rounded-md ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "נרשם..." : "יצירת משתמש"}
        </button>
        <Link href="/pages/signin" className="user-link">
          {buttonSubmit}
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
