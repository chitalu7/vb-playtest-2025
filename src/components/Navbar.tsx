// components/Navbar.tsx
"use client";

import { auth } from '../lib/firebaseConfig'; // Firebase config
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed: ', error);
    }
  };

  return (
    <header className="bg-shadow-black text-ice-blue py-4 px-8 flex justify-between items-center max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Velatum Bellum</h1>
      <button
        onClick={handleLogout}
        className="bg-blood-orange text-shadow-black px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
