"use client"; // Add this at the top to make it a Client Component

import { useState, useEffect } from 'react';
import { auth } from '../../lib/firebaseConfig'; // Firebase configuration
import { useRouter } from 'next/navigation'; // For redirection after logout
import ProtectedRoute from '../../components/ProtectedRoute'; // Import the HOC

const DashboardPage = () => {
  const [userName, setUserName] = useState('');
  const router = useRouter(); // For handling navigation after logout

  // Get the user's email from Firebase and derive the name
  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.email) {  // Check if user and user.email exist
      const emailName = user.email.split('@')[0] || ''; // Extract the part before '@'
      setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1)); // Capitalize first letter
    }
  }, []);

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
    <ProtectedRoute>
      {/* Top Header */}
      <header className="bg-shadow-black text-ice-blue py-4 px-8 flex justify-between items-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Velatum Bellum</h1>
        <button
          onClick={handleLogout}
          className="bg-blood-orange text-shadow-black px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black"
        >
          Logout
        </button>
      </header>

      {/* Username and Dashboard Section */}
      <div className="bg-smoke-gray py-4 px-8 text-center max-w-4xl mx-auto mt-4">
        <h2 className="text-2xl font-semibold">
          {userName ? `${userName}'s Dashboard` : 'Loading...'}
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mt-8">
        {/* Buttons - Styled to be larger */}
        <div className="grid grid-cols-3 gap-8 mt-8">
          <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
            Join a Game
          </button>
          <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
            Missions App
          </button>
          <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
            The Story
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;





// import ProtectedRoute from '../../components/ProtectedRoute'; // Import the HOC

// const DashboardPage = () => {
//   return (
//     <ProtectedRoute>
//       <div className="relative min-h-screen flex items-center justify-center bg-shadow-black text-ice-blue">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold">Welcome to Username Your Dashboard</h1>
//           <p className="text-lg mt-4">This is Your dashboard where you can access your game information.</p>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default DashboardPage;

  