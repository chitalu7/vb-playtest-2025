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
  const router = useRouter(); // Initialize the router

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // Attempt to log the user in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);

      // Redirect to the dashboard upon successful login
      router.push('/dashboard'); // Redirect to the dashboard page
    } catch (error) {
      setError('Failed to login: ' + (error as Error).message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
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

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blood-orange text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
          >
            Login
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



// "use client";

// import { useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../lib/firebaseConfig'; // Import the configured Firebase auth
// import Link from 'next/link'; // For navigation to the Create Account page

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); // Clear previous errors

//     try {
//       // Attempt to log the user in with Firebase Authentication
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       console.log('User logged in:', userCredential.user);
//       // You can redirect the user to the dashboard or home page here
//     } catch (error) {
//       setError('Failed to login: ' + (error as Error).message);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
//       <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         <form onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label className="block text-ice-blue">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-ice-blue">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
//               required
//             />
//           </div>

//           {error && <p className="text-red-500 mb-4">{error}</p>}

//           <button
//             type="submit"
//             className="w-full bg-blood-orange text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
//           >
//             Login
//           </button>
//         </form>

//         {/* Link to create account page */}
//         <div className="mt-4 text-center">
//           <p>Don't have an account?</p>
//           <Link href="/create-account" className="text-blood-orange hover:underline">
//             Create Account here
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


// "use client";  // This makes the component a Client Component

// import { useState } from 'react';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Implement login logic here (e.g., Firebase authentication)
//     console.log('Logging in with:', { email, password });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-shadow-black">
//       <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         <form onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label className="block text-ice-blue">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-ice-blue">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blood-orange text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

  
