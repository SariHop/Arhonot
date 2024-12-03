"use client"
import { useState } from 'react';
import { signin } from '../../services/userServices'
import { useRouter } from 'next/navigation'; // ייבוא מתוך next/navigation

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
        router.push('/'); // כאן אנחנו מפנים לעמוד הבית
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("שגיאה לא צפויה. אנא נסה שנית.");
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
          <div className="text-right my-4">
            <a
              href="/pages/reset-password"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              שכחתי סיסמא
            </a>
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
