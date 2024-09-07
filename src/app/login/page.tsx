"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig'; // Import Firebase auth
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import Link from 'next/link'; // For navigation to Create Account page

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter(); // Initialize the router

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Set loading to true

    try {
      // Attempt to log the user in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);

      // Redirect to the dashboard upon successful login
      router.push('/dashboard'); // Redirect to the dashboard page
    } catch (error) {
      setError('ACCESS DENIED! Invalid email or password! Please try again'); // Custom error message
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
      <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Display error message - placed at the top */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
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

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blood-orange hover:bg-ice-blue hover:text-shadow-black'}`}
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Link to create account page */}
        <div className="mt-4 text-center">
          <p>Don't have an account?</p>
          <Link href="/create-account" className="text-blood-orange hover:underline">
            Create Account here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;



