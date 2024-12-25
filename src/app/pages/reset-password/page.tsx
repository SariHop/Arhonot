'use client';

import { useState } from 'react';
import { forgotPassword } from '@/app/services/userServices';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const response = await forgotPassword(email);
            console.log(response);
            if (typeof response === 'string') {
                setError(response);
                setMessage('');
            } else if (response?.error) {
                setError('response.error');
                setMessage('');
            } else if (response?.message) {
                setMessage('נשלח אימייל לאיפוס סיסמא, נא בדוק את תיבת המייל שלך');
                setError('');
            }
            else {
                setError('Something went wrong.');
                setMessage('');
            }
        } catch {
            setError('An error occurred. Please try again later.');
            setMessage('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
            <h1>שינוי סיסמא</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">אימייל:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="הכנס אימייל"
                    required
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        margin: '0.5rem 0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: isLoading ? '#ddd' : '#0070f3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isLoading ? 'מתבצעת שליחה...' : 'שלחו לי קישור למייל'}
                </button>
            </form>
            {message && (
                <p className="mt-4 text-green-500">
                    {message}
                </p>
            )}
            {error && (
                < p className="mt-4 text-red-500">
                    {error}
                </p>
            )}
        </div >
    );
}
