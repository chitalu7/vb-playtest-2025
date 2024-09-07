"use client";

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig'; // Import the configured Firebase auth
import Link from 'next/link'; // Import Link for navigation to the login page

const CreateAccountPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success message

    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Account created successfully!');

      // Clear form fields after successful account creation
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      console.log('User created:', userCredential.user);
    } catch (error) {
      setError('Failed to create account: ' + (error as Error).message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
      <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleCreateAccount}>
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
          <div className="mb-4">
            <label className="block text-ice-blue">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <button
            type="submit"
            className="w-full bg-pale-amber  text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
          >

            Create Account
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

// "use client";

// import { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../lib/firebaseConfig'; // Import the configured Firebase auth

// const CreateAccountPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleCreateAccount = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Check if passwords match
//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     setError(''); // Clear previous errors
//     setSuccess(''); // Clear previous success message

//     try {
//       // Create a new user with Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       setSuccess('Account created successfully!');
//       console.log('User created:', userCredential.user);
//     } catch (error) {
//       setError('Failed to create account: ' + (error as Error).message);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
//       <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
//         <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
//         <form onSubmit={handleCreateAccount}>
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
//           <div className="mb-4">
//             <label className="block text-ice-blue">Confirm Password</label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
//               required
//             />
//           </div>

//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           {success && <p className="text-green-500 mb-4">{success}</p>}

//           <button
//             type="submit"
//             className="w-full bg-blood-orange text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
//           >
//             Create Account
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateAccountPage;



