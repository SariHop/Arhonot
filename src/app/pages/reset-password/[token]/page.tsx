"use client"; // הגדרת הרכיב כרכיב לקוח

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // הוספת useParams
import { resetPassword } from '../../../services/userServices'
import { passwordSchemaZod } from '../../../types/IUser'
import { z } from "zod";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams(); // קבלת הפרמטרים מה-URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [updatedToken, setUpdatedToken] = useState("");
  useEffect(() => {
    if (Array.isArray(token)) {
      setUpdatedToken(token[0]); // עדכון ה-token ב-state אם הוא מערך
    } else if (token) {
      setUpdatedToken(token); // עדכון ה-token ב-state אם הוא לא מערך
    } else {
      setError("Invalid token.");
    }
  }, [token]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { password, confirmPassword };
    try {
      passwordSchemaZod.parse(formData);
      const validToken = Array.isArray(token) ? token[0] : token;
      if (!validToken) {
        setError("Invalid token.");
        return;
      }

      if (!updatedToken) {
        setError("Invalid token.");
        return;
      }

      try {
        const response = await resetPassword(updatedToken, password);
        console.log(response);
        if (typeof response === 'string') {
          setError(response); // הצגת שגיאה אם התגובה היא string
        } else if (response?.error) {
          setError(response.error); // הצגת שגיאה אם יש error
        } else if (response?.message) {
          setSuccess(true); // הצגת הודעת הצלחה
        } else {
          setError("un knowen error");
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        setError("Failed to reset password. Please try again.");
      }
    }
    catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setSuccess(false);
        setError(validationError.errors[0].message); // הצגת ההודעה הראשונה
      } else {
        setSuccess(false);
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 py-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        {success ? (
          <div className="text-green-500">
            Your password has been reset successfully! You can now log in.
            <br />
            <button
              onClick={() => window.location.href = '/pages/signin'} // כאן אתה מפנה את המשתמש לדף ההתחברות
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              התחברות
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                סיסמא חדשה
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
                אימות סיסמא
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
              שינוי סיסמא
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
