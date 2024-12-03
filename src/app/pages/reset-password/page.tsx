'use client';

import { useState } from 'react';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage('Email sent! Please check your inbox.');
            } else {
                const data = await response.json();
                setMessage(data.message || 'Something went wrong.');
            }
        } catch {
            setMessage('An error occurred. Please try again later.');
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
                    placeholder="Enter your email"
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
                <p style={{ marginTop: '1rem', color: message.includes('error') ? 'red' : 'green' }}>
                    {message}
                </p>
            )}
        </div>
    );
}
