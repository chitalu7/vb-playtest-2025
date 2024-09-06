"use client"; // Ensure this is a client component

import { useState } from 'react';

const CreateAccountPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Reset the error if passwords match
    setError('');

    // Add create account logic here (e.g., Firebase authentication)
    console.log('Creating account with:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-shadow-black">
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

          {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error if passwords don't match */}

          <button
            type="submit"
            className="w-full bg-pale-amber text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;

// "use client"; // Make sure this is a client component since we are using event handlers

// import { useState } from 'react';

// const CreateAccountPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleCreateAccount = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Add create account logic here (e.g., Firebase authentication)
//     console.log('Creating account with:', { email, password });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-shadow-black">
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
//           <button
//             type="submit"
//             className="w-full bg-pale-amber text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
//           >
//             Create Account
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateAccountPage;
