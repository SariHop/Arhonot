"use client"
import { useState } from 'react';
import { signin } from '../../services/userServices'
import { useRouter } from 'next/navigation'; // ייבוא מתוך next/navigation
import Link from 'antd/es/typography/Link';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // שימוש ב-router מתוך next/navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }
    try {
      const result = await signin(email, password);
      if (result.success) {
        console.log('User signed in successfully:', result);
        router.push('/pages/user'); // כאן אנחנו מפנים לעמוד הבית
      } else {
        if (result.status == 402) {
          toast.error(`אימייל זה לא קיים במערכת\nנא נסה להרשם.`);
        }
        else if (result.status == 403) {
          setError("הסיסמא שהוקשה שגויה");
        }
        else {
          toast.error(`Signin failed: \n${result.message}`);
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("שגיאה לא צפויה. אנא נסה שנית.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Sign In</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              אמייל:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              סיסמא:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
          <div className="flex justify-between items-center my-4">
            <Link
              href="/pages/reset-password"
              className="user-link"
            >
              שכחתי סיסמא
            </Link>
            <Link
              href="/pages/signup"
              className="user-link"
            >
              הרשמה
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            התחברות
          </button>
        </form>
      </div>
    </div>
  );
}
