"use client"; // הגדרת הרכיב כרכיב לקוח

import { useState } from "react";
import { useParams } from "next/navigation"; // הוספת useParams
import { resetPassword } from '../../../services/userServices'

const ResetPasswordPage: React.FC = () => {
  //   const router = useRouter();
  const { token } = useParams(); // קבלת הפרמטרים מה-URL
  console.log(token);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (Array.isArray(token)) {
      resetPassword(token[0], password)
    }
    else {
      // אם token לא קיים או שהוא ריק
      if (!token) {
        setError("Invalid token.");
        return;
      }

      await resetPassword(token, password); // הפונקציה שלך לאיפוס הסיסמה
    }
    setSuccess(true);
    // try {
    //   const response = await fetch("/api/reset-password", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ token, password }), // שימוש ב-token מ-useParams
    //   });

    //   if (response.ok) {
    //     setSuccess(true);
    //   } else {
    //     const data = await response.json();
    //     setError(data.message || "An error occurred.");
    //   }
    // } catch {
    //   setError("An error occurred while resetting the password.");
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 py-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        {success ? (
          <div className="text-green-500">
            Your password has been reset successfully! You can now log in.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
