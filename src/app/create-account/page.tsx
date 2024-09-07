"use client";

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig';
import Link from 'next/link';

const CreateAccountPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('SUBMISSION DENIED! Passwords do not match');
      return;
    }

    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success message
    setLoading(true); // Set loading to true

    try {
      // Create a new user with Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Account created successfully!');
      
      // Clear form fields after successful account creation
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Failed to create account: ' + (error as Error).message);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
      <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {/* Display success or error message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleCreateAccount}>
          <div className="mb-4">
            <label className="block text-ice-blue">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
              required
              disabled={loading} // Disable input when loading
            />
          </div>
          <div className="mb-4">
            <label className="block text-ice-blue">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
              required
              disabled={loading} // Disable input when loading
            />
          </div>
          <div className="mb-4">
            <label className="block text-ice-blue">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
              required
              disabled={loading} // Disable input when loading
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pale-amber text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black'}`}
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Link to login page */}
        <div className="mt-4 text-center">
          <p>Already have an account?</p>
          <Link href="/login" className="text-blood-orange hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;



