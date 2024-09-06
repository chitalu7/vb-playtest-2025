"use client";  // This makes the component a Client Component

import { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement login logic here (e.g., Firebase authentication)
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-shadow-black">
      <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-ice-blue">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
              required
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
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blood-orange text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

  
