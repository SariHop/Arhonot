"use client"
import React, { useState } from 'react';
import { userSchemaZod, IUserType } from '../../types/IUser'
import { ZodError } from 'zod'; // הייבוא של ZodError
import { signup } from '@/app/services/userServices';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from 'next/link';
import { EyeInvisibleTwoTone, EyeTwoTone } from '@ant-design/icons';


const SignUp = () => {
  const [formData, setFormData] = useState<IUserType>({
    password: "",
    confirmPassword: "",
    email: "",
    userName: "",
    gender: "זכר",
    dateOfBirth: new Date('10/10/2000'),
    age: 0,
    city: "ירושלים",
    sensitive: "none"
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IUserType, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validationResult = await userSchemaZod.parseAsync(formData);
      console.log("הנתונים תקינים:", validationResult);
      setErrors({});
      const result = await signup(formData);

      if (result.success) {
        console.log("Signup successful:", result.data);
        // הפניה לעמוד הבית או המשך תהליך
      } else {
        console.error("Signup failed:", result.message);
        if (result.status == 404) {
          toast.error("אימייל זה כבר קיים במערכת,\nנסה אולי התחברות");
        }
        else {
          toast.error(`Signup failed: \n${result.message}`);
        }
      }
    } catch (err) {
      // עדכון השגיאות במידה ו- Zod לא אישר את הנתונים
      const fieldErrors: Partial<Record<keyof IUserType, string>> = {};
      if (err instanceof ZodError) {
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as keyof IUserType] = error.message;
          }
        });
        setErrors(fieldErrors);
        console.log("lllll", err)
      }
    }
  };

  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100 pb-20">
      <form
        onSubmit={(e) => { handleSubmit(e) }}
        className="bg-white p-8 shadow-md rounded-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Registration</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* UserName */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="userName">
              User Name
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
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
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
              Confirm Password
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
            <label className="block text-sm font-medium text-gray-700" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name='gender'
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="dateOfBirth">
              Date of Birth
            </label>
            <input
              type="date"
              value={
                formData.dateOfBirth
                  ? new Date(formData.dateOfBirth).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: new Date(e.target.value) })
              }
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* City */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="city">
              City
            </label>
            <input
              id="city"
              name='city'
              value={formData.city}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>
        </div>
        {/* Confirm Password */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="dateOfBirth">
            Date of Birth
          </label>
          <input
            type="date"
            value={
              formData.dateOfBirth
                ? new Date(formData.dateOfBirth).toISOString().split('T')[0]
                : ''
            }
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: new Date(e.target.value) })
            }
          />


          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="gender">
            Gender
          </label>
          <select
            id="gender"
            name='gender'
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

        {/* City */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="city">
            City
          </label>
          <input
            id="city"
            name='city'
            value={formData.city}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>

        {/* Sensitive */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="sensitive">
            Sensitive To:
          </label>
          <select
            id="sensitive"
            name='sensitive'
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        >
          Register
        </button>
        <Link href="/pages/signin" className="user-link">
          התחברות
        </Link>
      </form>

    </div>
  );
};

export default SignUp;
