"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig'; // Import Firebase auth
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import Link from 'next/link'; // For navigation to Create Account page and Forgot Password page

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Add Remember Me state
  const router = useRouter(); // Initialize the router

  // Regex for validating email format
  const emailRegex = /\S+@\S+\.\S+/;

  // Map Firebase error codes to user-friendly messages
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'INVALID EMAIL ADDRESS! \nPlease enter a valid email.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please check your email or create an account.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again or reset your password.';
      case 'auth/too-many-requests':
        return 'Too many login attempts. Please wait and try again later.';
      default:
        return 'ACCESS DENIED!. \nPlease try again.';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Validate email format
    if (!emailRegex.test(email)) {
      setError('Invalid email format. Please enter a valid email.');
      return;
    }

    // Basic password check
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Set Firebase persistence based on Remember Me option
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      // Attempt to log the user in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);

      // Redirect to the dashboard upon successful login
      router.push('/dashboard'); // Redirect to the dashboard page
    } catch (error: any) {
      setError(getErrorMessage(error.code)); // Display user-friendly error message
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
      <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Display error message - placed at the top */}
        {/* {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
            <span>{error}</span>
          </div>
        )} */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
            {error.split('\n').map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
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

          {/* Remember Me Checkbox */}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)} // Toggle Remember Me state
                className="form-checkbox text-blood-orange"
              />
              <span className="ml-2 text-ice-blue">Remember Me</span>
            </label>
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

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-blood-orange hover:underline">
            Forgot Password?
          </Link>
        </div>

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
// import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
// import { auth } from '../../lib/firebaseConfig'; // Import Firebase auth
// import { useRouter } from 'next/navigation'; // Import useRouter for redirection
// import Link from 'next/link'; // For navigation to Create Account page and Forgot Password page

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false); // Add Remember Me state
//   const router = useRouter(); // Initialize the router

//   // Regex for validating email format
//   const emailRegex = /\S+@\S+\.\S+/;

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); // Clear previous errors

//     // Validate email format
//     if (!emailRegex.test(email)) {
//       setError('Invalid email format. Please enter a valid email.');
//       return;
//     }

//     // Basic password check
//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long.');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Set Firebase persistence based on Remember Me option
//       await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

//       // Attempt to log the user in with Firebase Authentication
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       console.log('User logged in:', userCredential.user);

//       // Redirect to the dashboard upon successful login
//       router.push('/dashboard'); // Redirect to the dashboard page
//     } catch (error) {
//       setError('ACCESS DENIED! Invalid email or password! Please try again'); // Custom error message
//     } finally {
//       setLoading(false); // Stop loading state
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
//       <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//         {/* Display error message - placed at the top */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleLogin}>
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

//           {/* Remember Me Checkbox */}
//           <div className="mb-4">
//             <label className="inline-flex items-center">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)} // Toggle Remember Me state
//                 className="form-checkbox text-blood-orange"
//               />
//               <span className="ml-2 text-ice-blue">Remember Me</span>
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className={`w-full p-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blood-orange hover:bg-ice-blue hover:text-shadow-black'}`}
//             disabled={loading} // Disable button when loading
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         {/* Forgot Password Link */}
//         <div className="mt-4 text-center">
//           <Link href="/forgot-password" className="text-blood-orange hover:underline">
//             Forgot Password?
//           </Link>
//         </div>

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


// "use client";

// import { useState } from 'react';
// import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
// import { auth } from '../../lib/firebaseConfig'; // Import Firebase auth
// import { useRouter } from 'next/navigation'; // Import useRouter for redirection
// import Link from 'next/link'; // For navigation to Create Account page

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false); // Add Remember Me state
//   const router = useRouter(); // Initialize the router

//   // Regex for validating email format
//   const emailRegex = /\S+@\S+\.\S+/;

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); // Clear previous errors

//     // Validate email format
//     if (!emailRegex.test(email)) {
//       setError('Invalid email format. Please enter a valid email.');
//       return;
//     }

//     // Basic password check
//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long.');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Set Firebase persistence based on Remember Me option
//       await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

//       // Attempt to log the user in with Firebase Authentication
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       console.log('User logged in:', userCredential.user);

//       // Redirect to the dashboard upon successful login
//       router.push('/dashboard'); // Redirect to the dashboard page
//     } catch (error) {
//       setError('ACCESS DENIED! Invalid email or password! Please try again'); // Custom error message
//     } finally {
//       setLoading(false); // Stop loading state
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
//       <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//         {/* Display error message - placed at the top */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleLogin}>
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

//           {/* Remember Me Checkbox */}
//           <div className="mb-4">
//             <label className="inline-flex items-center">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)} // Toggle Remember Me state
//                 className="form-checkbox text-blood-orange"
//               />
//               <span className="ml-2 text-ice-blue">Remember Me</span>
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className={`w-full p-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blood-orange hover:bg-ice-blue hover:text-shadow-black'}`}
//             disabled={loading} // Disable button when loading
//           >
//             {loading ? 'Logging in...' : 'Login'}
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

