import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-shadow-black">
      <div className="text-center text-ice-blue">
        <h1 className="text-4xl font-bold mb-6">Welcome to Velatum Bellum Playtest</h1>
        <p className="text-lg mb-6">Join the action, create an account, or login to continue.</p>
        <div className="flex flex-col items-center space-y-4">
          <Link href="/login" className="w-64 text-center text-shadow-black bg-blood-orange px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black transition-all duration-300">
            Login
          </Link>
          <Link href="/create-account" className="w-64 text-center text-shadow-black bg-pale-amber px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black transition-all duration-300">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

// import Link from 'next/link';

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-shadow-black">
//       <div className="text-center text-ice-blue">
//         <h1 className="text-4xl font-bold mb-6">Welcome to Velatum Bellum Playtest</h1>
//         <p className="text-lg mb-4">Join the action, create an account, or login to continue.</p>
//         <div>
//           <Link href="/login">
//             <div className="text-shadow-black bg-blood-orange px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black">
//               Login
//             </div>
//           </Link>
//           <Link href="/create-account">
//             <div className="ml-4 text-shadow-black bg-pale-amber px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black">
//               Create Account
//             </div>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;


// const LandingPage = () => {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-shadow-black">
//         <h1 className="text-4xl text-ice-blue">Landing Page</h1>
//       </div>
//     );
//   };
  
//   export default LandingPage;
  
  