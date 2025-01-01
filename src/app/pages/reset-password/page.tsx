"use client";

import { useState } from "react";
import { forgotPassword } from "@/app/services/userServices";
import Link from "antd/es/typography/Link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const response = await forgotPassword(email);
      console.log(response);
      if (typeof response === "string") {
        setError(response);
        setMessage("");
      } else if (response?.error) {
        setError("response.error");
        setMessage("");
      } else if (response?.message) {
        setMessage("נשלח אימייל לאיפוס סיסמא, נא בדוק את תיבת המייל שלך");
        setError("");
      } else {
        setError("Something went wrong.");
        setMessage("");
      }
    } catch {
      setError("An error occurred. Please try again later.");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-blue-300">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md m-5">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          שינוי סיסמא
        </h2>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            אימייל:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="הזן כתובת מייל"
            className="mt-1 mb-4 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder:italic"
            required
          />
          <div className="flex justify-between items-center my-4">
            <Link href="/pages/signin" className="user-link">
              התחברות
            </Link>
            <Link href="/pages/signup" className="user-link">
              הרשמה
            </Link>
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white rounded-md ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "מתבצעת שליחה..." : "שלחו לי קישור למייל"}
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
