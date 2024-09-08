"use client";

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig'; // Firebase auth
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    setLoading(true);

    try {
      // Send password reset email using Firebase
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (error) {
      setError('Failed to send password reset email: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
      <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        {/* Display success or error message */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center" role="alert">
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <label className="block text-ice-blue">Enter your email to reset your password</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
              required
              disabled={loading} // Disable input when loading
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blood-orange hover:bg-ice-blue hover:text-shadow-black'}`}
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Sending Reset Email...' : 'Send Reset Email'}
          </button>
        </form>

        {/* Link back to login page */}
        <div className="mt-4 text-center">
          <Link href="/login" className="text-blood-orange hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
