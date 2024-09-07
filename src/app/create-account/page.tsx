"use client";

import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig';
import { useRouter } from 'next/navigation'; // For redirection
import Link from 'next/link';

const CreateAccountPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize router for redirection

  // Regex for validating email format
  const emailRegex = /\S+@\S+\.\S+/;

  // Function to validate password strength
  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength;
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format
    if (!emailRegex.test(email)) {
      setError('Invalid email format. Please enter a valid email.');
      return;
    }

    // Validate password strength
    if (!validatePassword(password)) {
      setError(
        'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
      );
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Create a new user with Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Account created successfully! Redirecting to login page...');

      // Clear form fields after successful account creation
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirect to the login page after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000); // 3-second delay
    } catch (error) {
      setError('Failed to create account: ' + (error as Error).message);
    } finally {
      setLoading(false);
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pale-amber hover:bg-ice-blue hover:text-shadow-black'}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

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
// import { auth } from '../../lib/firebaseConfig';
// import Link from 'next/link';

// const CreateAccountPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Regex for validating email format
//   const emailRegex = /\S+@\S+\.\S+/;

//   // Function to validate password strength
//   const validatePassword = (password: string) => {
//     const hasUpperCase = /[A-Z]/.test(password);
//     const hasLowerCase = /[a-z]/.test(password);
//     const hasNumber = /\d/.test(password);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//     const isValidLength = password.length >= 8;
//     return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength;
//   };

//   const handleCreateAccount = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate email format
//     if (!emailRegex.test(email)) {
//       setError('Invalid email format. Please enter a valid email.');
//       return;
//     }

//     // Validate password strength
//     if (!validatePassword(password)) {
//       setError(
//         'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
//       );
//       return;
//     }

//     // Check if passwords match
//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       // Create a new user with Firebase Authentication
//       await createUserWithEmailAndPassword(auth, email, password);
//       setSuccess('Account created successfully!');
      
//       // Clear form fields after successful account creation
//       setEmail('');
//       setPassword('');
//       setConfirmPassword('');
//     } catch (error) {
//       setError('Failed to create account: ' + (error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
//       <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
//         <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

//         {/* Display success or error message */}
//         {success && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center" role="alert">
//             <span className="block sm:inline">{success}</span>
//           </div>
//         )}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleCreateAccount}>
//           <div className="mb-4">
//             <label className="block text-ice-blue">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
//               required
//               disabled={loading}
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
//               disabled={loading}
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
//               disabled={loading}
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className={`w-full p-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pale-amber hover:bg-ice-blue hover:text-shadow-black'}`}
//             disabled={loading}
//           >
//             {loading ? 'Creating Account...' : 'Create Account'}
//           </button>
//         </form>

//         <div className="mt-4 text-center">
//           <p>Already have an account?</p>
//           <Link href="/login" className="text-blood-orange hover:underline">
//             Login here
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAccountPage;


// "use client";

// import { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../../lib/firebaseConfig';
// import Link from 'next/link';

// const CreateAccountPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false); // Add loading state

//   const handleCreateAccount = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError('SUBMISSION DENIED! Passwords do not match');
//       return;
//     }

//     setError(''); // Clear previous errors
//     setSuccess(''); // Clear previous success message
//     setLoading(true); // Set loading to true

//     try {
//       // Create a new user with Firebase Authentication
//       await createUserWithEmailAndPassword(auth, email, password);
//       setSuccess('Account created successfully!');
      
//       // Clear form fields after successful account creation
//       setEmail('');
//       setPassword('');
//       setConfirmPassword('');
//     } catch (error) {
//       setError('Failed to create account: ' + (error as Error).message);
//     } finally {
//       setLoading(false); // Stop loading state
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
//       <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
//         <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

//         {/* Display success or error message */}
//         {success && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center" role="alert">
//             <span className="block sm:inline">{success}</span>
//           </div>
//         )}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleCreateAccount}>
//           <div className="mb-4">
//             <label className="block text-ice-blue">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
//               required
//               disabled={loading} // Disable input when loading
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
//               disabled={loading} // Disable input when loading
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
//               disabled={loading} // Disable input when loading
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className={`w-full p-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pale-amber text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black'}`}
//             disabled={loading} // Disable button when loading
//           >
//             {loading ? 'Creating Account...' : 'Create Account'}
//           </button>
//         </form>

//         {/* Link to login page */}
//         <div className="mt-4 text-center">
//           <p>Already have an account?</p>
//           <Link href="/login" className="text-blood-orange hover:underline">
//             Login here
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAccountPage;



