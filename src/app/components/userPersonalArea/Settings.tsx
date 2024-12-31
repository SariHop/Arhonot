"use client";
import React, { useState } from "react";
import { UpdateUserType, updateUserSchemaZod } from "../../types/IUser";
import { ZodError } from "zod";
import { updateUser } from "@/app/services/userServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUser from "@/app/store/userStore";
import { useRouter } from "next/navigation";
import { useCityQuery } from "@/app/hooks/cityQueryHook";

const Settings = () => {
  const {
    _id,
    userName: storedUserName,
    email: storedEmail,
    gender: storedGender,
    dateOfBirth: storedDateOfBirth,
    city: storedCity,
    sensitive: storedSensitive,
  } = useUser();

  const [formData, setFormData] = useState<UpdateUserType>({
    email: storedEmail || "",
    userName: storedUserName || "",
    gender:
      storedGender === "זכר" || storedGender === "נקבה" ? storedGender : "זכר",
    dateOfBirth: storedDateOfBirth
      ? new Date(storedDateOfBirth)
      : new Date("2000-10-10"),
    age: 0,
    city: storedCity || "ירושלים",
    sensitive:
      storedSensitive === "cold" ||
      storedSensitive === "heat" ||
      storedSensitive === "none"
        ? storedSensitive
        : "none", // המרה
  });

  const router = useRouter();
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateUserType, string>>
  >({});
  const { data: cities, isLoading, error } = useCityQuery();

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
    try {
      const validatedForm = await updateUserSchemaZod.parseAsync(formData);
      console.log("הנתונים תקינים:", validatedForm);
      setErrors({});
      const result = await updateUser(_id, { ...formData });

      if (result && result.success) {
        toast.success("העדכון בוצע בהצלחה!");
        console.log("עדכון הצליח:", result.data);
        router.push("/pages/user/personal_area");
      } else {
        toast.error(`עדכון נכשל: ${result.message}`);
      }
    } catch (error) {
      const fieldErrors: Partial<Record<keyof UpdateUserType, string>> = {};
      if (error instanceof ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof UpdateUserType] = err.message;
          }
        });
        setErrors(fieldErrors);
        console.error("שגיאות בטופס:", error);
      }
    }
  };

  if (isLoading) return <div>טוען...</div>;
  if (error) return <div>שגיאה בטעינת ערים{String(error)}</div>;

  return (
    <div className="flex justify-center items-center h-full py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 shadow-lg rounded-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          עדכון פרטים
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* User Name */}
          <div>
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
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              אימייל
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Gender */}
          <div>
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
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="זכר">זכר</option>
              <option value="נקבה">נקבה</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="dateOfBirth"
            >
              תאריך לידה
            </label>
            <input
              type="date"
              id="dateOfBirth"
              value={
                formData.dateOfBirth
                  ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dateOfBirth: new Date(e.target.value),
                })
              }
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="city"
            >
              עיר
            </label>
            {isLoading ? (
              <p>טוען ערים...</p>
            ) : error ? (
              <p className="text-red-500">שגיאה בטעינת הערים</p>
            ) : (
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {cities.map((city: string) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            )}
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
          </div>

          {/* Sensitive */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="sensitive"
            >
              רגישות
            </label>
            <select
              id="sensitive"
              name="sensitive"
              value={formData.sensitive}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="none">ללא</option>
              <option value="cold">לקור</option>
              <option value="heat">לחום</option>
            </select>
            {errors.sensitive && (
              <p className="text-red-500 text-sm">{errors.sensitive}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-indigo-700"
        >
          שמירה
        </button>
        {/* Cancel Button */}
        <button
          type="button"
          onClick={() =>
            setFormData({
              email: storedEmail || "",
              userName: storedUserName || "",
              gender:
                storedGender === "זכר" || storedGender === "נקבה"
                  ? storedGender
                  : "זכר",
              dateOfBirth: storedDateOfBirth
                ? new Date(storedDateOfBirth)
                : new Date("2000-10-10"),
              age: 0,
              city: storedCity || "ירושלים",
              sensitive:
                storedSensitive === "cold" ||
                storedSensitive === "heat" ||
                storedSensitive === "none"
                  ? storedSensitive
                  : "none",
            })
          }
          className="mt-4 w-full py-2 px-4 bg-gray-400 text-white rounded-md hover:bg-gray-600"
        >
          ביטול
        </button>
      </form>
    </div>
  );
};

export default Settings;
