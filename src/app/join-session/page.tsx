"use client"; // Mark this as a Client Component

import { useState, useEffect, useRef } from 'react';
import { get, ref, update } from "firebase/database";
import { useRouter } from 'next/navigation';
import { database } from '../../lib/firebaseConfig';

const JoinSession = () => {
  const [sessionName, setSessionName] = useState('');
  const [sessionPassword, setSessionPassword] = useState('');
  const [sessionOptions, setSessionOptions] = useState<string[]>([]); // Session dropdown options
  const [error, setError] = useState('');
  const router = useRouter();
  const sessionNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const dbRef = ref(database, 'gameSessions');
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        const sessions = snapshot.val();
        const sessionNames = Object.keys(sessions).map(key => sessions[key].gameName);
        setSessionOptions(sessionNames);
      }
    };

    fetchSessions(); // Fetch sessions when the page loads
    setSessionName('');
    setSessionPassword('');

    if (sessionNameInputRef.current) {
      sessionNameInputRef.current.value = '';
      sessionNameInputRef.current.focus();
    }
  }, []);

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const dbRef = ref(database, `gameSessions/${sessionName}`);
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const sessionData = snapshot.val();

        // Check if the session password is correct
        if (sessionData.password !== sessionPassword) {
          setError('Incorrect Session Access Key');
          return;
        }

        // Check if the number of players is already 5 (4 players + 1 Vault Keeper)
        const currentPlayers = sessionData.players || [];
        if (currentPlayers.length >= 5) {
          setError('Session is full. No more players can join.');
          return;
        }

        // Add the player to the session
        const user = { playerName: 'YourPlayerName', assassin: 'SelectedAssassin' }; // Replace with actual user data
        currentPlayers.push(user);

        await update(ref(database, `gameSessions/${sessionName}`), { players: currentPlayers });

        // Redirect to Assassin selection page
        router.push(`/assassin-selection?sessionName=${sessionName}`);
      } else {
        setError('Session not found. Please check the session name.');
      }
    } catch (error) {
      setError('Failed to join session. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-shadow-black text-ice-blue">
      <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Join Game Session</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleJoinSession} autoComplete="off" className="text-center">
          {/* Session Name */}
          <div className="mb-4 flex flex-col items-center">
            <label className="block text-lg text-ice-blue mb-2">Session Name</label>
            <input
              list="sessionOptions" // Tied to the datalist below
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              ref={sessionNameInputRef}
              className="w-3/4 p-2 border rounded bg-shadow-black text-ice-blue text-center"
              placeholder="Enter or Select Session Name"
              autoComplete="off"
              required
            />
            <datalist id="sessionOptions">
              {sessionOptions.map((session, index) => (
                <option key={index} value={session} />
              ))}
            </datalist>
          </div>

          {/* Session Access Key */}
          <div className="mb-4 flex flex-col items-center">
            <label className="block text-lg text-ice-blue mb-2">Session Access Key</label>
            <input
              type="password"
              value={sessionPassword}
              onChange={(e) => setSessionPassword(e.target.value)}
              className="w-3/4 p-2 border rounded bg-shadow-black text-ice-blue text-center"
              placeholder="Enter Session Key"
              autoComplete="off"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-3/4 bg-blood-orange text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
          >
            Join Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinSession;



// "use client"; // Mark the component as a client-side component

// import { useState, useEffect } from 'react';
// import { get, ref } from "firebase/database"; // Assuming you are using Firebase Realtime DB
// import { useRouter } from 'next/navigation'; // Import useRouter for redirection
// import { database } from '../../lib/firebaseConfig'; // Firebase config for database

// const JoinSession = () => {
//   const [sessionName, setSessionName] = useState(''); // Track Session Name input
//   const [sessionPassword, setSessionPassword] = useState(''); // Track Session Password input
//   const [error, setError] = useState('');
//   const router = useRouter(); // For handling navigation after successful join

//   // Clear input fields and set placeholder text every time the component is mounted
//   useEffect(() => {
//     setSessionName(''); // Clear session name
//     setSessionPassword(''); // Clear session password
//   }, []); // Empty dependency array ensures this runs once when the component mounts

//   // Handle form submission to join the session
//   const handleJoinSession = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); // Clear previous errors

//     try {
//       const dbRef = ref(database, `gameSessions/${sessionName}`); // Reference the game session by sessionName
//       const snapshot = await get(dbRef);

//       if (snapshot.exists() && snapshot.val().password === sessionPassword) {
//         // If session exists and password is correct, navigate to Assassin selection page
//         router.push(`/?sessionName=${sessionName}`);
//       } else {
//         setError('Session not found or incorrect access key. Please try again.');
//       }
//     } catch (error) {
//       setError('Failed to join session. Please try again.');
//       console.error(error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-shadow-black text-ice-blue">
//       <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Join Game Session</h2>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
//             <span>{error}</span>
//           </div>
//         )}

//         {/* Disable auto-complete on the form */}
//         <form onSubmit={handleJoinSession} autoComplete="off" className="text-center">
//           {/* Session Name */}
//           <div className="mb-4 flex flex-col items-center">
//             <label className="block text-lg text-ice-blue mb-2">Session Name</label>
//             <input
//               type="text"
//               name="new-session-name" // Use an unusual name to prevent browser autofill
//               value={sessionName}
//               onChange={(e) => setSessionName(e.target.value)}
//               className="w-3/4 p-2 border rounded bg-shadow-black text-ice-blue text-center" // Center the input text and adjust width
//               placeholder="Enter Session Name" // Placeholder text
//               autoComplete="off" // Disable autocomplete on the input
//               required
//             />
//           </div>

//           {/* Session Access Key (password) */}
//           <div className="mb-4 flex flex-col items-center">
//             <label className="block text-lg text-ice-blue mb-2">Session Access Key</label>
//             <input
//               type="password"
//               name="new-session-key" // Use an unusual name to prevent browser autofill
//               value={sessionPassword}
//               onChange={(e) => setSessionPassword(e.target.value)}
//               className="w-3/4 p-2 border rounded bg-shadow-black text-ice-blue text-center" // Center the input text and adjust width
//               placeholder="Enter Session Key" // Placeholder text
//               autoComplete="off" // Disable autocomplete on the input
//               required
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-3/4 bg-blood-orange text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
//           >
//             Join Session
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default JoinSession;




// "use client"; // Mark the component as a client-side component

// import { useState, useEffect } from 'react';
// import { get, ref } from "firebase/database"; // Assuming you are using Firebase Realtime DB
// import { useRouter } from 'next/navigation'; // Import useRouter for redirection
// import { database } from '../../lib/firebaseConfig'; // Firebase config for database

// const JoinSession = () => {
//   const [sessionName, setSessionName] = useState(''); // Track Session Name input
//   const [sessionPassword, setSessionPassword] = useState(''); // Track Session Password input
//   const [error, setError] = useState('');
//   const router = useRouter(); // For handling navigation after successful join

//   // Clear input fields and set placeholder text every time the component is mounted
//   useEffect(() => {
//     setSessionName(''); // Clear session name
//     setSessionPassword(''); // Clear session password
//   }, []); // Empty dependency array ensures this runs once when the component mounts

//   // Handle form submission to join the session
//   const handleJoinSession = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); // Clear previous errors

//     try {
//       const dbRef = ref(database, `gameSessions/${sessionName}`); // Reference the game session by sessionName
//       const snapshot = await get(dbRef);

//       if (snapshot.exists() && snapshot.val().password === sessionPassword) {
//         // If session exists and password is correct, navigate to Assassin selection page
//         router.push(`/assassin-selection?sessionName=${sessionName}`);
//       } else {
//         setError('Session not found or incorrect access key. Please try again.');
//       }
//     } catch (error) {
//       setError('Failed to join session. Please try again.');
//       console.error(error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-shadow-black text-ice-blue">
//       <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Join Game Session</h2>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
//             <span>{error}</span>
//           </div>
//         )}

//         {/* Disable auto-complete on the form */}
//         <form onSubmit={handleJoinSession} autoComplete="off" className="text-center">
//           {/* Session Name */}
//           <div className="mb-4 flex flex-col items-center">
//             <label className="block text-lg text-ice-blue mb-2">Session Name</label>
//             <input
//               type="text"
//               name="new-session-name" // Use an unusual name to prevent browser autofill
//               value={sessionName}
//               onChange={(e) => setSessionName(e.target.value)}
//               className="w-3/4 p-2 border rounded bg-shadow-black text-ice-blue text-center" // Center the input text and adjust width
//               placeholder="Enter Session Name" // Placeholder text
//               autoComplete="off" // Disable autocomplete on the input
//               required
//             />
//           </div>

//           {/* Session Access Key (password) */}
//           <div className="mb-4 flex flex-col items-center">
//             <label className="block text-lg text-ice-blue mb-2">Session Access Key</label>
//             <input
//               type="password"
//               name="new-session-key" // Use an unusual name to prevent browser autofill
//               value={sessionPassword}
//               onChange={(e) => setSessionPassword(e.target.value)}
//               className="w-3/4 p-2 border rounded bg-shadow-black text-ice-blue text-center" // Center the input text and adjust width
//               placeholder="Enter Session Key" // Placeholder text
//               autoComplete="off" // Disable autocomplete on the input
//               required
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-3/4 bg-blood-orange text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
//           >
//             Join Session
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default JoinSession;







// "use client";

// import { useState } from 'react';
// import { ref, get } from 'firebase/database';
// import { database, auth } from '../../lib/firebaseConfig'; // Firebase config for auth and database
// import { useRouter } from 'next/navigation'; // For navigation after joining session
// import ProtectedRoute from '../../components/ProtectedRoute'; // For protecting the route

// const JoinSession = () => {
//   const [sessionName, setSessionName] = useState(''); // For input session name
//   const [accessKey, setAccessKey] = useState(''); // For input session access key (password)
//   const [error, setError] = useState(''); // For displaying errors
//   const router = useRouter();

//   // Function to handle joining a session
//   const handleJoinSession = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     try {
//       // Reference the session in Firebase by session name
//       const sessionRef = ref(database, `gameSessions/${sessionName}`);
//       const sessionSnapshot = await get(sessionRef);

//       // Check if the session exists
//       if (!sessionSnapshot.exists()) {
//         setError('Session not found');
//         return;
//       }

//       const sessionData = sessionSnapshot.val();

//       // Validate the session access key
//       if (sessionData.password !== accessKey) {
//         setError('Incorrect session access key');
//         return;
//       }

//       // Redirect to the assassin selection screen if successful
//       router.push(`/assassin-selection?sessionName=${sessionName}`);
//     } catch (error) {
//       console.error('Failed to join session:', error);
//       setError('Error joining session');
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
//         <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
//           <h2 className="text-2xl font-bold mb-6 text-center">Join Game Session</h2>

//           {/* Display error message */}
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleJoinSession}>
//             <div className="mb-4">
//               <label className="block text-lg text-center">Session Name</label>
//               <input
//                 type="text"
//                 value={sessionName}
//                 onChange={(e) => setSessionName(e.target.value)}
//                 className="w-full p-2 border rounded bg-shadow-black text-ice-blue text-center"
//                 placeholder="Enter session name"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-lg text-center">Session Access Key</label>
//               <input
//                 type="password"
//                 value={accessKey}
//                 onChange={(e) => setAccessKey(e.target.value)}
//                 className="w-full p-2 border rounded bg-shadow-black text-ice-blue text-center"
//                 placeholder="Enter session access key"
//                 required
//               />
//             </div>

//             {/* Submit button */}
//             <button
//               type="submit"
//               className="w-full bg-blood-orange text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
//             >
//               Join Session
//             </button>
//           </form>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default JoinSession;

