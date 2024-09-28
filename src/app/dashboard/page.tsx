"use client";

import { useState, useEffect } from 'react';
import { auth } from '../../lib/firebaseConfig'; // Firebase config with Realtime Database
import { useRouter } from 'next/navigation'; // For navigation on logout
import { ref, set, get } from 'firebase/database'; // Firebase Database functions
import { database } from '../../lib/firebaseConfig'; // Firebase config for database
import ProtectedRoute from '../../components/ProtectedRoute'; // HOC for protected routes

const DashboardPage = () => {
  const [userName, setUserName] = useState('');
  const [isVaultKeeper, setIsVaultKeeper] = useState(false); // To track if the user is VaultKeeper
  const [gameName, setGameName] = useState(''); // Game session name input
  const [maxPlayers, setMaxPlayers] = useState(2); // Max players dropdown
  const [gameType, setGameType] = useState('Beginner'); // Game type
  const [gameRounds, setGameRounds] = useState('Best of 1'); // Game rounds
  const [turnTimeLimit, setTurnTimeLimit] = useState(60); // Turn time limit in seconds (slider)
  const [password, setPassword] = useState(''); // Game session password
  const [isSessionSectionOpen, setIsSessionSectionOpen] = useState(false); // To toggle session section
  const [confirmationMessage, setConfirmationMessage] = useState(''); // Confirmation message for user feedback
  const [errorMessage, setErrorMessage] = useState(''); // Error message for user feedback
  const router = useRouter(); // For handling navigation after logout

  // Generate a random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 5; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(password);
  };

  // Get the user's email from Firebase and derive the name
  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.email) {
      const emailName = user.email.split('@')[0] || ''; // Extract the part before '@'
      setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));

      if (emailName.toLowerCase() === 'vaultkeeper') {
        setIsVaultKeeper(true); // If the user is VaultKeeper, show extra options
        generatePassword(); // Automatically generate the game session password
      }
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

  // Close messages after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setConfirmationMessage('');
      setErrorMessage('');
    }, 5000);

    return () => clearTimeout(timeout); // Cleanup timer on unmount or new message
  }, [confirmationMessage, errorMessage]);

  // Close message manually
  const closeMessage = () => {
    setConfirmationMessage('');
    setErrorMessage('');
  };

  // Create session in Firebase Realtime Database
  const createSession = async () => {
    // Check if the game name is empty
    if (!gameName.trim()) {
      setErrorMessage('Game session name cannot be empty.');
      setConfirmationMessage(''); // Clear any previous confirmation message
      return;
    }

    const gameNameRef = ref(database, `gameSessions/${gameName}`);
    const snapshot = await get(gameNameRef);
    if (snapshot.exists()) {
      setErrorMessage('Session with this name already exists.');
      setConfirmationMessage(''); // Clear any previous confirmation message
      return;
    }

    const sessionData = {
      gameName,
      maxPlayers,
      gameType,
      gameRounds,
      startingHand: { tacticalCards: 5, powerCards: 1 },
      startingBloodOathStones: 1,
      initialMissionCards: Math.floor(60 / maxPlayers),
      turnTimeLimit,
      password,
      createdAt: Date.now(),
      players: [], // Empty array for players; this will be updated as players join
      board: {
        size: "13x13",
        scarletArena: {
          location: [6, 6],
          status: "open"
        },
        quadrants: [
          { id: 1, color: "Blue" },
          { id: 2, color: "Green" },
          { id: 3, color: "Violet" },
          { id: 4, color: "Crimson" }
        ],
        specialSquares: {
          sanctuaries: [{ location: [2, 2], status: "open" }],
          qorinthPoolSquares: [{ location: [8, 8] }],
          fateSquares: [{ location: [4, 4] }],
          engagementSquares: [{ location: [10, 10] }]
        }
      },
      movementDice: {
        dice1: 6,
        dice2: 6,
        doublesRolled: false
      },
      legendaryAssassins: {
        available: ["Legendary Assassin 1", "Legendary Assassin 2"]
      },
      resetTool: {
        status: "enabled",
        lastReset: null
      },
      sessionStatus: "active"
    };

    // Store the session data in Firebase
    try {
      await set(ref(database, `gameSessions/${gameName}`), sessionData);
      setConfirmationMessage('Session Created Successfully!'); // Show confirmation
      setErrorMessage(''); // Clear any previous error message
      setIsSessionSectionOpen(false); // Close the section once session is created
    } catch (error) {
      setErrorMessage('Failed to create session. Please try again.');
      setConfirmationMessage(''); // Clear any previous confirmation message
    }
  };

  return (
    <ProtectedRoute>
      {/* Parallax Background */}
      <div className="parallax min-h-screen bg-fixed bg-center bg-cover" style={{ backgroundImage: 'url()' }}>
        
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
          <div className="grid grid-cols-3 gap-8 mt-8">
            <button
                onClick={() => router.push('/join-session')} // Navigate to JoinSession page
                className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black"
              >
                Join a Game
            </button>

            <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
              Missions App
            </button>
            <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
              The Story
            </button>
          </div>

          {/* Display Confirmation or Error Message */}
          {confirmationMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4 relative" role="alert">
              {confirmationMessage}
              <button onClick={closeMessage} className="absolute top-0 right-0 px-4 py-3">
                <span className="text-green-700">×</span>
              </button>
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 relative" role="alert">
              {errorMessage}
              <button onClick={closeMessage} className="absolute top-0 right-0 px-4 py-3">
                <span className="text-red-700">×</span>
              </button>
            </div>
          )}

          {/* Vault Keeper's Extra Form Section - Drop Down */}
          {isVaultKeeper && (
            <div className="w-full max-w-4xl mt-12">
              {/* Toggle Button for Create a Session */}
              <button
                className="bg-smoke-gray text-ice-blue w-full p-4 rounded-lg hover:bg-shadow-black flex justify-between items-center"
                onClick={() => setIsSessionSectionOpen(!isSessionSectionOpen)}
              >
                <span className="text-2xl font-bold text-center w-full">Create a Game Session</span>
                <span>{isSessionSectionOpen ? '▲' : '▼'}</span>
              </button>

              {/* Session Form - Only show if the section is open */}
              {isSessionSectionOpen && (
                <div className="p-6 mt-4 bg-shadow-black rounded-lg">
                  <div className="mb-4">
                    <label className="block text-lg">Game Session Name</label>
                    <input
                      type="text"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
                      placeholder="Enter a name for your game"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-lg">Max Players</label>
                    <select
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(Number(e.target.value))}
                      className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
                    >
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-lg">Game Type</label>
                    <select
                      value={gameType}
                      onChange={(e) => setGameType(e.target.value)}
                      className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
                    >
                      <option value="Beginner">Beginner (Win 3 Status Stones)</option>
                      <option value="Intermediate">Intermediate (Win 6 Status Stones)</option>
                      <option value="Advanced">Advanced (Win 9 Status Stones)</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-lg">Game Rounds</label>
                    <select
                      value={gameRounds}
                      onChange={(e) => setGameRounds(e.target.value)}
                      className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
                    >
                      <option value="Best of 1">Best of 1</option>
                      <option value="Best of 3">Best of 3</option>
                    </select>
                  </div>

                  {/* Starting Hand and Blood Oath Stones (not editable) */}
                  <div className="mb-4">
                    <label className="block text-lg">Starting Hand</label>
                    <p className="p-2 bg-smoke-gray text-ice-blue rounded">
                      6 Cards (5 Tactical Cards, 1 Power Card)
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-lg">Starting Blood Oath Stones</label>
                    <p className="p-2 bg-smoke-gray text-ice-blue rounded">
                      1 Stone (Auto-distributed)
                    </p>
                  </div>

                  {/* Initial Mission Cards (auto-distributed) */}
                  <div className="mb-4">
                    <label className="block text-lg">Initial Mission Cards</label>
                    <p className="p-2 bg-smoke-gray text-ice-blue rounded">
                      {Math.floor(60 / maxPlayers)} Mission Cards (Auto-distributed)
                    </p>
                  </div>

                  {/* Turn Time Limit - Slider */}
                  <div className="mb-4">
                    <label className="block text-lg">Turn Time Limit</label>
                    <input
                      type="range"
                      min={60}
                      max={120}
                      step={10}
                      value={turnTimeLimit}
                      onChange={(e) => setTurnTimeLimit(Number(e.target.value))}
                      className="w-full slider"
                    />
                    <div className="text-center mt-2 text-ice-blue">
                      {turnTimeLimit} seconds
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-lg">Session Access Key</label>
                    <input
                      type="text"
                      value={password}
                      readOnly
                      className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={createSession}
                      className="bg-blood-orange text-shadow-black p-2 rounded-lg hover:bg-ice-blue hover:text-shadow-black"
                    >
                      Create Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;

// "use client";

// import { useState, useEffect } from 'react';
// import { auth } from '../../lib/firebaseConfig'; // Firebase config with Realtime Database
// import { useRouter } from 'next/navigation'; // For navigation on logout
// import { ref, set, get } from 'firebase/database'; // Firebase Database functions
// import { database } from '../../lib/firebaseConfig'; // Firebase config for database
// import ProtectedRoute from '../../components/ProtectedRoute'; // HOC for protected routes

// const DashboardPage = () => {
//   const [userName, setUserName] = useState('');
//   const [isVaultKeeper, setIsVaultKeeper] = useState(false); // To track if the user is VaultKeeper
//   const [gameName, setGameName] = useState(''); // Game session name input
//   const [maxPlayers, setMaxPlayers] = useState(2); // Max players dropdown
//   const [gameType, setGameType] = useState('Beginner'); // Game type
//   const [gameRounds, setGameRounds] = useState('Best of 1'); // Game rounds
//   const [turnTimeLimit, setTurnTimeLimit] = useState(60); // Turn time limit in seconds (slider)
//   const [password, setPassword] = useState(''); // Game session password
//   const [isSessionSectionOpen, setIsSessionSectionOpen] = useState(false); // To toggle session section
//   const [confirmationMessage, setConfirmationMessage] = useState(''); // Confirmation message for user feedback
//   const [errorMessage, setErrorMessage] = useState(''); // Error message for user feedback
//   const router = useRouter(); // For handling navigation after logout

//   // Generate a random password
//   const generatePassword = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let password = '';
//     for (let i = 0; i < 5; i++) {
//       password += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setPassword(password);
//   };

//   // Get the user's email from Firebase and derive the name
//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user && user.email) {
//       const emailName = user.email.split('@')[0] || ''; // Extract the part before '@'
//       setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));

//       if (emailName.toLowerCase() === 'vaultkeeper') {
//         setIsVaultKeeper(true); // If the user is VaultKeeper, show extra options
//         generatePassword(); // Automatically generate the game session password
//       }
//     }
//   }, []);

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       router.push('/login'); // Redirect to login page after logout
//     } catch (error) {
//       console.error('Logout failed: ', error);
//     }
//   };

//   // Create session in Firebase Realtime Database
//   const createSession = async () => {
//     // Check if the game name is empty
//     if (!gameName.trim()) {
//       setErrorMessage('Game session name cannot be empty.');
//       setConfirmationMessage(''); // Clear any previous confirmation message
//       return;
//     }

//     const gameNameRef = ref(database, `gameSessions/${gameName}`);
//     const snapshot = await get(gameNameRef);
//     if (snapshot.exists()) {
//       setErrorMessage('Session with this name already exists.');
//       setConfirmationMessage(''); // Clear any previous confirmation message
//       return;
//     }

//     const sessionData = {
//       gameName,
//       maxPlayers,
//       gameType,
//       gameRounds,
//       startingHand: { tacticalCards: 5, powerCards: 1 },
//       startingBloodOathStones: 1,
//       initialMissionCards: Math.floor(60 / maxPlayers),
//       turnTimeLimit,
//       password,
//       createdAt: Date.now(),
//       players: [], // Empty array for players; this will be updated as players join
//       board: {
//         size: "13x13",
//         scarletArena: {
//           location: [6, 6],
//           status: "open"
//         },
//         quadrants: [
//           { id: 1, color: "Blue" },
//           { id: 2, color: "Green" },
//           { id: 3, color: "Violet" },
//           { id: 4, color: "Crimson" }
//         ],
//         specialSquares: {
//           sanctuaries: [{ location: [2, 2], status: "open" }],
//           qorinthPoolSquares: [{ location: [8, 8] }],
//           fateSquares: [{ location: [4, 4] }],
//           engagementSquares: [{ location: [10, 10] }]
//         }
//       },
//       movementDice: {
//         dice1: 6,
//         dice2: 6,
//         doublesRolled: false
//       },
//       legendaryAssassins: {
//         available: ["Legendary Assassin 1", "Legendary Assassin 2"]
//       },
//       resetTool: {
//         status: "enabled",
//         lastReset: null
//       },
//       sessionStatus: "active"
//     };

//     // Store the session data in Firebase
//     try {
//       await set(ref(database, `gameSessions/${gameName}`), sessionData);
//       setConfirmationMessage('Session Created Successfully!'); // Show confirmation
//       setErrorMessage(''); // Clear any previous error message
//       setIsSessionSectionOpen(false); // Close the section once session is created
//     } catch (error) {
//       setErrorMessage('Failed to create session. Please try again.');
//       setConfirmationMessage(''); // Clear any previous confirmation message
//     }
//   };

//   return (
//     <ProtectedRoute>
//       {/* Parallax Background */}
//       <div className="parallax min-h-screen bg-fixed bg-center bg-cover" style={{ backgroundImage: 'url()' }}>
        
//         {/* Top Header */}
//         <header className="bg-shadow-black text-ice-blue py-4 px-8 flex justify-between items-center max-w-4xl mx-auto">
//           <h1 className="text-3xl font-bold">Velatum Bellum</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-blood-orange text-shadow-black px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black"
//           >
//             Logout
//           </button>
//         </header>

//         {/* Username and Dashboard Section */}
//         <div className="bg-smoke-gray py-4 px-8 text-center max-w-4xl mx-auto mt-4">
//           <h2 className="text-2xl font-semibold">
//             {userName ? `${userName}'s Dashboard` : 'Loading...'}
//           </h2>
//         </div>

//         {/* Main Content */}
//         <div className="flex flex-col items-center justify-center mt-8">
//           <div className="grid grid-cols-3 gap-8 mt-8">
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               Join a Game
//             </button>
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               Missions App
//             </button>
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               The Story
//             </button>
//           </div>

//           {/* Display Confirmation or Error Message */}
//           {confirmationMessage && (
//             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4" role="alert">
//               {confirmationMessage}
//             </div>
//           )}
//           {errorMessage && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4" role="alert">
//               {errorMessage}
//             </div>
//           )}

//           {/* Vault Keeper's Extra Form Section - Drop Down */}
//           {isVaultKeeper && (
//             <div className="w-full max-w-4xl mt-12">
//               {/* Toggle Button for Create a Session */}
//               <button
//                 className="bg-smoke-gray text-ice-blue w-full p-4 rounded-lg hover:bg-shadow-black flex justify-between items-center"
//                 onClick={() => setIsSessionSectionOpen(!isSessionSectionOpen)}
//               >
//                 <span className="text-2xl font-bold text-center w-full">Create a Game Session</span>
//                 <span>{isSessionSectionOpen ? '▲' : '▼'}</span>
//               </button>

//               {/* Session Form - Only show if the section is open */}
//               {isSessionSectionOpen && (
//                 <div className="p-6 mt-4 bg-shadow-black rounded-lg">
//                   <div className="mb-4">
//                     <label className="block text-lg">Game Session Name</label>
//                     <input
//                       type="text"
//                       value={gameName}
//                       onChange={(e) => setGameName(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                       placeholder="Enter a name for your game"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-lg">Max Players</label>
//                     <select
//                       value={maxPlayers}
//                       onChange={(e) => setMaxPlayers(Number(e.target.value))}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value={2}>2</option>
//                       <option value={3}>3</option>
//                       <option value={4}>4</option>
//                     </select>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Game Type</label>
//                     <select
//                       value={gameType}
//                       onChange={(e) => setGameType(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value="Beginner">Beginner (Win 3 Status Stones)</option>
//                       <option value="Intermediate">Intermediate (Win 6 Status Stones)</option>
//                       <option value="Advanced">Advanced (Win 9 Status Stones)</option>
//                     </select>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Game Rounds</label>
//                     <select
//                       value={gameRounds}
//                       onChange={(e) => setGameRounds(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value="Best of 1">Best of 1</option>
//                       <option value="Best of 3">Best of 3</option>
//                     </select>
//                   </div>

//                   {/* Starting Hand and Blood Oath Stones (not editable) */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Starting Hand</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       6 Cards (5 Tactical Cards, 1 Power Card)
//                     </p>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-lg">Starting Blood Oath Stones</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       1 Stone (Auto-distributed)
//                     </p>
//                   </div>

//                   {/* Initial Mission Cards (auto-distributed) */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Initial Mission Cards</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       {Math.floor(60 / maxPlayers)} Mission Cards (Auto-distributed)
//                     </p>
//                   </div>

//                   {/* Turn Time Limit - Slider */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Turn Time Limit</label>
//                     <input
//                       type="range"
//                       min={60}
//                       max={120}
//                       step={10}
//                       value={turnTimeLimit}
//                       onChange={(e) => setTurnTimeLimit(Number(e.target.value))}
//                       className="w-full slider"
//                     />
//                     <div className="text-center mt-2 text-ice-blue">
//                       {turnTimeLimit} seconds
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Session Access Key</label>
//                     <input
//                       type="text"
//                       value={password}
//                       readOnly
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     />
//                   </div>

//                   <div className="flex justify-between">
//                     <button
//                       onClick={createSession}
//                       className="bg-blood-orange text-shadow-black p-2 rounded-lg hover:bg-ice-blue hover:text-shadow-black"
//                     >
//                       Create Session
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default DashboardPage;

// "use client";

// import { useState, useEffect } from 'react';
// import { auth } from '../../lib/firebaseConfig'; // Firebase config with Realtime Database
// import { useRouter } from 'next/navigation'; // For navigation on logout
// import { ref, set, get } from 'firebase/database'; // Firebase Database functions
// import { database } from '../../lib/firebaseConfig'; // Firebase config for database
// import ProtectedRoute from '../../components/ProtectedRoute'; // HOC for protected routes

// const DashboardPage = () => {
//   const [userName, setUserName] = useState('');
//   const [isVaultKeeper, setIsVaultKeeper] = useState(false); // To track if the user is VaultKeeper
//   const [gameName, setGameName] = useState(''); // Game session name input
//   const [maxPlayers, setMaxPlayers] = useState(2); // Max players dropdown
//   const [gameType, setGameType] = useState('Beginner'); // Game type
//   const [gameRounds, setGameRounds] = useState('Best of 1'); // Game rounds
//   const [turnTimeLimit, setTurnTimeLimit] = useState(60); // Turn time limit in seconds (slider)
//   const [password, setPassword] = useState(''); // Game session password
//   const [isSessionSectionOpen, setIsSessionSectionOpen] = useState(false); // To toggle session section
//   const [confirmationMessage, setConfirmationMessage] = useState(''); // Confirmation message for user feedback
//   const [errorMessage, setErrorMessage] = useState(''); // Error message for user feedback
//   const router = useRouter(); // For handling navigation after logout

//   // Generate a random password
//   const generatePassword = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let password = '';
//     for (let i = 0; i < 5; i++) {
//       password += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setPassword(password);
//   };

//   // Get the user's email from Firebase and derive the name
//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user && user.email) {
//       const emailName = user.email.split('@')[0] || ''; // Extract the part before '@'
//       setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));

//       if (emailName.toLowerCase() === 'vaultkeeper') {
//         setIsVaultKeeper(true); // If the user is VaultKeeper, show extra options
//         generatePassword(); // Automatically generate the game session password
//       }
//     }
//   }, []);

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       router.push('/login'); // Redirect to login page after logout
//     } catch (error) {
//       console.error('Logout failed: ', error);
//     }
//   };

//   // Create session in Firebase Realtime Database
//   const createSession = async () => {
//     const gameNameRef = ref(database, `gameSessions/${gameName}`);
//     const snapshot = await get(gameNameRef);
//     if (snapshot.exists()) {
//       setErrorMessage('Session with this name already exists.');
//       setConfirmationMessage(''); // Clear any previous confirmation message
//       return;
//     }

//     const sessionData = {
//       gameName,
//       maxPlayers,
//       gameType,
//       gameRounds,
//       startingHand: { tacticalCards: 5, powerCards: 1 },
//       startingBloodOathStones: 1,
//       initialMissionCards: Math.floor(60 / maxPlayers),
//       turnTimeLimit,
//       password,
//       createdAt: Date.now(),
//       players: [], // Empty array for players; this will be updated as players join
//       board: {
//         size: "13x13",
//         scarletArena: {
//           location: [6, 6],
//           status: "open"
//         },
//         quadrants: [
//           { id: 1, color: "Blue" },
//           { id: 2, color: "Green" },
//           { id: 3, color: "Violet" },
//           { id: 4, color: "Crimson" }
//         ],
//         specialSquares: {
//           sanctuaries: [{ location: [2, 2], status: "open" }],
//           qorinthPoolSquares: [{ location: [8, 8] }],
//           fateSquares: [{ location: [4, 4] }],
//           engagementSquares: [{ location: [10, 10] }]
//         }
//       },
//       movementDice: {
//         dice1: 6,
//         dice2: 6,
//         doublesRolled: false
//       },
//       legendaryAssassins: {
//         available: ["Legendary Assassin 1", "Legendary Assassin 2"]
//       },
//       resetTool: {
//         status: "enabled",
//         lastReset: null
//       },
//       sessionStatus: "active"
//     };

//     // Store the session data in Firebase
//     try {
//       await set(ref(database, `gameSessions/${gameName}`), sessionData);
//       setConfirmationMessage('Session Created Successfully!'); // Show confirmation
//       setErrorMessage(''); // Clear any previous error message
//       setIsSessionSectionOpen(false); // Close the section once session is created
//     } catch (error) {
//       setErrorMessage('Failed to create session. Please try again.');
//       setConfirmationMessage(''); // Clear any previous confirmation message
//     }
//   };

//   return (
//     <ProtectedRoute>
//       {/* Parallax Background */}
//       <div className="parallax min-h-screen bg-fixed bg-center bg-cover" style={{ backgroundImage: 'url()' }}>
        
//         {/* Top Header */}
//         <header className="bg-shadow-black text-ice-blue py-4 px-8 flex justify-between items-center max-w-4xl mx-auto">
//           <h1 className="text-3xl font-bold">Velatum Bellum</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-blood-orange text-shadow-black px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black"
//           >
//             Logout
//           </button>
//         </header>

//         {/* Username and Dashboard Section */}
//         <div className="bg-smoke-gray py-4 px-8 text-center max-w-4xl mx-auto mt-4">
//           <h2 className="text-2xl font-semibold">
//             {userName ? `${userName}'s Dashboard` : 'Loading...'}
//           </h2>
//         </div>

//         {/* Main Content */}
//         <div className="flex flex-col items-center justify-center mt-8">
//           <div className="grid grid-cols-3 gap-8 mt-8">
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               Join a Game
//             </button>
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               Missions App
//             </button>
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               The Story
//             </button>
//           </div>

//           {/* Display Confirmation or Error Message */}
//           {confirmationMessage && (
//             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4" role="alert">
//               {confirmationMessage}
//             </div>
//           )}
//           {errorMessage && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4" role="alert">
//               {errorMessage}
//             </div>
//           )}

//           {/* Vault Keeper's Extra Form Section - Drop Down */}
//           {isVaultKeeper && (
//             <div className="w-full max-w-4xl mt-12">
//               {/* Toggle Button for Create a Session */}
//               <button
//                 className="bg-smoke-gray text-ice-blue w-full p-4 rounded-lg hover:bg-shadow-black flex justify-between items-center"
//                 onClick={() => setIsSessionSectionOpen(!isSessionSectionOpen)}
//               >
//                 <span className="text-2xl font-bold text-center w-full">Create a Game Session</span>
//                 <span>{isSessionSectionOpen ? '▲' : '▼'}</span>
//               </button>

//               {/* Session Form - Only show if the section is open */}
//               {isSessionSectionOpen && (
//                 <div className="p-6 mt-4 bg-shadow-black rounded-lg">
//                   <div className="mb-4">
//                     <label className="block text-lg">Game Session Name</label>
//                     <input
//                       type="text"
//                       value={gameName}
//                       onChange={(e) => setGameName(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                       placeholder="Enter a name for your game"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-lg">Max Players</label>
//                     <select
//                       value={maxPlayers}
//                       onChange={(e) => setMaxPlayers(Number(e.target.value))}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value={2}>2</option>
//                       <option value={3}>3</option>
//                       <option value={4}>4</option>
//                     </select>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Game Type</label>
//                     <select
//                       value={gameType}
//                       onChange={(e) => setGameType(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value="Beginner">Beginner (Win 3 Status Stones)</option>
//                       <option value="Intermediate">Intermediate (Win 6 Status Stones)</option>
//                       <option value="Advanced">Advanced (Win 9 Status Stones)</option>
//                     </select>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Game Rounds</label>
//                     <select
//                       value={gameRounds}
//                       onChange={(e) => setGameRounds(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value="Best of 1">Best of 1</option>
//                       <option value="Best of 3">Best of 3</option>
//                     </select>
//                   </div>

//                   {/* Starting Hand and Blood Oath Stones (not editable) */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Starting Hand</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       6 Cards (5 Tactical Cards, 1 Power Card)
//                     </p>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-lg">Starting Blood Oath Stones</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       1 Stone (Auto-distributed)
//                     </p>
//                   </div>

//                   {/* Initial Mission Cards (auto-distributed) */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Initial Mission Cards</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       {Math.floor(60 / maxPlayers)} Mission Cards (Auto-distributed)
//                     </p>
//                   </div>

//                   {/* Turn Time Limit - Slider */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Turn Time Limit</label>
//                     <input
//                       type="range"
//                       min={60}
//                       max={120}
//                       step={10}
//                       value={turnTimeLimit}
//                       onChange={(e) => setTurnTimeLimit(Number(e.target.value))}
//                       className="w-full slider"
//                     />
//                     <div className="text-center mt-2 text-ice-blue">
//                       {turnTimeLimit} seconds
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Session Access Key</label>
//                     <input
//                       type="text"
//                       value={password}
//                       readOnly
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     />
//                   </div>

//                   <div className="flex justify-between">
//                     <button
//                       onClick={createSession}
//                       className="bg-blood-orange text-shadow-black p-2 rounded-lg hover:bg-ice-blue hover:text-shadow-black"
//                     >
//                       Create Session
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default DashboardPage;


// "use client";

// import { useState, useEffect } from 'react';
// import { auth } from '../../lib/firebaseConfig'; // Firebase config with Realtime Database
// import { useRouter } from 'next/navigation'; // For navigation on logout
// import { ref, set, get } from 'firebase/database'; // Firebase Database functions
// import { database } from '../../lib/firebaseConfig'; // Firebase config for database
// import ProtectedRoute from '../../components/ProtectedRoute'; // HOC for protected routes

// const DashboardPage = () => {
//   const [userName, setUserName] = useState('');
//   const [isVaultKeeper, setIsVaultKeeper] = useState(false); // To track if the user is VaultKeeper
//   const [gameName, setGameName] = useState(''); // Game session name input
//   const [maxPlayers, setMaxPlayers] = useState(2); // Max players dropdown
//   const [gameType, setGameType] = useState('Beginner'); // Game type
//   const [gameRounds, setGameRounds] = useState('Best of 1'); // Game rounds
//   const [turnTimeLimit, setTurnTimeLimit] = useState(60); // Turn time limit in seconds (slider)
//   const [password, setPassword] = useState(''); // Game session password
//   const [isSessionSectionOpen, setIsSessionSectionOpen] = useState(false); // To toggle session section
//   const router = useRouter(); // For handling navigation after logout

//   // Generate a random password
//   const generatePassword = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let password = '';
//     for (let i = 0; i < 5; i++) {
//       password += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setPassword(password);
//   };

//   // Get the user's email from Firebase and derive the name
//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user && user.email) {
//       const emailName = user.email.split('@')[0] || ''; // Extract the part before '@'
//       setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));

//       if (emailName.toLowerCase() === 'vaultkeeper') {
//         setIsVaultKeeper(true); // If the user is VaultKeeper, show extra options
//         generatePassword(); // Automatically generate the game session password
//       }
//     }
//   }, []);

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       router.push('/login'); // Redirect to login page after logout
//     } catch (error) {
//       console.error('Logout failed: ', error);
//     }
//   };

//   // Create session in Firebase Realtime Database
//   const createSession = async () => {
//     const gameNameRef = ref(database, `gameSessions/${gameName}`);
//     const snapshot = await get(gameNameRef);
//     if (snapshot.exists()) {
//       alert('Session with this name already exists.');
//       return;
//     }

//     const sessionData = {
//       gameName,
//       maxPlayers,
//       gameType,
//       gameRounds,
//       startingHand: { tacticalCards: 5, powerCards: 1 },
//       startingBloodOathStones: 1,
//       initialMissionCards: Math.floor(60 / maxPlayers),
//       turnTimeLimit,
//       password,
//       createdAt: Date.now(),
//       players: [], // Empty array for players; this will be updated as players join
//       board: {
//         size: "13x13",
//         scarletArena: {
//           location: [6, 6],
//           status: "open"
//         },
//         quadrants: [
//           { id: 1, color: "Blue" },
//           { id: 2, color: "Green" },
//           { id: 3, color: "Violet" },
//           { id: 4, color: "Crimson" }
//         ],
//         specialSquares: {
//           sanctuaries: [{ location: [2, 2], status: "open" }],
//           qorinthPoolSquares: [{ location: [8, 8] }],
//           fateSquares: [{ location: [4, 4] }],
//           engagementSquares: [{ location: [10, 10] }]
//         }
//       },
//       movementDice: {
//         dice1: 6,
//         dice2: 6,
//         doublesRolled: false
//       },
//       legendaryAssassins: {
//         available: ["Legendary Assassin 1", "Legendary Assassin 2"]
//       },
//       resetTool: {
//         status: "enabled",
//         lastReset: null
//       },
//       sessionStatus: "active"
//     };

//     // Store the session data in Firebase
//     try {
//       await set(ref(database, `gameSessions/${gameName}`), sessionData);
//       alert('Session Created Successfully!');
//       setIsSessionSectionOpen(false); // Close the section once session is created
//     } catch (error) {
//       console.error('Failed to create session:', error);
//     }
//   };

//   return (
//     <ProtectedRoute>
//       {/* Parallax Background */}
//       <div className="parallax min-h-screen bg-fixed bg-center bg-cover" style={{ backgroundImage: 'url()' }}>
        
//         {/* Top Header */}
//         <header className="bg-shadow-black text-ice-blue py-4 px-8 flex justify-between items-center max-w-4xl mx-auto">
//           <h1 className="text-3xl font-bold">Velatum Bellum</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-blood-orange text-shadow-black px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black"
//           >
//             Logout
//           </button>
//         </header>

//         {/* Username and Dashboard Section */}
//         <div className="bg-smoke-gray py-4 px-8 text-center max-w-4xl mx-auto mt-4">
//           <h2 className="text-2xl font-semibold">
//             {userName ? `${userName}'s Dashboard` : 'Loading...'}
//           </h2>
//         </div>

//         {/* Main Content */}
//         <div className="flex flex-col items-center justify-center mt-8">
//           <div className="grid grid-cols-3 gap-8 mt-8">
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               Join a Game
//             </button>
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               Missions App
//             </button>
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               The Story
//             </button>
//           </div>

//           {/* Vault Keeper's Extra Form Section - Drop Down */}
//           {isVaultKeeper && (
//             <div className="w-full max-w-4xl mt-12">
//               {/* Toggle Button for Create a Session */}
//               <button
//                 className="bg-smoke-gray text-ice-blue w-full p-4 rounded-lg hover:bg-shadow-black flex justify-between items-center"
//                 onClick={() => setIsSessionSectionOpen(!isSessionSectionOpen)}
//               >
//                 <span className="text-2xl font-bold text-center w-full">Create a Game Session</span>
//                 <span>{isSessionSectionOpen ? '▲' : '▼'}</span>
//               </button>

//               {/* Session Form - Only show if the section is open */}
//               {isSessionSectionOpen && (
//                 <div className="p-6 mt-4 bg-shadow-black rounded-lg">
//                   <div className="mb-4">
//                     <label className="block text-lg">Game Session Name</label>
//                     <input
//                       type="text"
//                       value={gameName}
//                       onChange={(e) => setGameName(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                       placeholder="Enter a name for your game"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-lg">Max Players</label>
//                     <select
//                       value={maxPlayers}
//                       onChange={(e) => setMaxPlayers(Number(e.target.value))}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value={2}>2</option>
//                       <option value={3}>3</option>
//                       <option value={4}>4</option>
//                     </select>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Game Type</label>
//                     <select
//                       value={gameType}
//                       onChange={(e) => setGameType(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value="Beginner">Beginner (Win 3 Status Stones)</option>
//                       <option value="Intermediate">Intermediate (Win 6 Status Stones)</option>
//                       <option value="Advanced">Advanced (Win 9 Status Stones)</option>
//                     </select>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Game Rounds</label>
//                     <select
//                       value={gameRounds}
//                       onChange={(e) => setGameRounds(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value="Best of 1">Best of 1</option>
//                       <option value="Best of 3">Best of 3</option>
//                     </select>
//                   </div>

//                   {/* Starting Hand and Blood Oath Stones (not editable) */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Starting Hand</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       6 Cards (5 Tactical Cards, 1 Power Card)
//                     </p>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-lg">Starting Blood Oath Stones</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       1 Stone (Auto-distributed)
//                     </p>
//                   </div>

//                   {/* Initial Mission Cards (auto-distributed) */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Initial Mission Cards</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       {Math.floor(60 / maxPlayers)} Mission Cards (Auto-distributed)
//                     </p>
//                   </div>

//                   {/* Turn Time Limit - Slider */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Turn Time Limit</label>
//                     <input
//                       type="range"
//                       min={60}
//                       max={120}
//                       step={10}
//                       value={turnTimeLimit}
//                       onChange={(e) => setTurnTimeLimit(Number(e.target.value))}
//                       className="w-full slider"
//                     />
//                     <div className="text-center mt-2 text-ice-blue">
//                       {turnTimeLimit} seconds
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Session Access Key</label>
//                     <input
//                       type="text"
//                       value={password}
//                       readOnly
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     />
//                   </div>

//                   <div className="flex justify-between">
//                     <button
//                       onClick={createSession}
//                       className="bg-blood-orange text-shadow-black p-2 rounded-lg hover:bg-ice-blue hover:text-shadow-black"
//                     >
//                       Create Session
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default DashboardPage;





                  
                     

// "use client";

// import { useState, useEffect } from 'react';
// import { auth } from '../../lib/firebaseConfig'; // Firebase config with Realtime Database
// import { ref, set, get } from "firebase/database"; // Firebase Database functions
// import { database } from '../../lib/firebaseConfig'; // Firebase config for database
// import ProtectedRoute from '../../components/ProtectedRoute'; // HOC for protected routes

// const DashboardPage = () => {
//   const [userName, setUserName] = useState('');
//   const [isVaultKeeper, setIsVaultKeeper] = useState(false); // To track if the user is VaultKeeper
//   const [gameName, setGameName] = useState(''); // Game session name input
//   const [maxPlayers, setMaxPlayers] = useState(2); // Max players dropdown
//   const [gameType, setGameType] = useState('Beginner'); // Game type
//   const [gameRounds, setGameRounds] = useState('Best of 1'); // Game rounds
//   const [turnTimeLimit, setTurnTimeLimit] = useState(60); // Turn time limit in seconds (slider)
//   const [password, setPassword] = useState(''); // Game session password
//   const [isSessionSectionOpen, setIsSessionSectionOpen] = useState(false); // To toggle session section
//   const [error, setError] = useState(''); // Error message for session creation
//   const [successMessage, setSuccessMessage] = useState(''); // Success message for session creation

//   // Generate a random password
//   const generatePassword = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let password = '';
//     for (let i = 0; i < 5; i++) {
//       password += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setPassword(password);
//   };

//   // Get the user's email from Firebase and derive the name
//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user && user.email) {
//       const emailName = user.email.split('@')[0] || ''; // Extract the part before '@'
//       setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));

//       if (emailName.toLowerCase() === 'vaultkeeper') {
//         setIsVaultKeeper(true); // If the user is VaultKeeper, show extra options
//         generatePassword(); // Automatically generate the game session password
//       }
//     }
//   }, []);

//   // Handle creating a session
//   const createSession = async () => {
//     if (!gameName.trim()) {
//       setError('Please provide a valid session name.');
//       return;
//     }

//     try {
//       const sessionRef = ref(database, `gameSessions/${gameName}`);
//       const snapshot = await get(sessionRef);

//       if (snapshot.exists()) {
//         setError('Session name already exists. Please choose another name.');
//         return;
//       }

//       const sessionData = {
//         gameName,
//         maxPlayers: 5, // Set max players to 5 (4 players + 1 Vault Keeper)
//         gameType,
//         gameRounds,
//         startingHand: { tacticalCards: 5, powerCards: 1 },
//         startingBloodOathStones: 1,
//         initialMissionCards: Math.floor(60 / 4), // Distribute mission cards based on 4 players
//         turnTimeLimit,
//         password,
//         createdAt: Date.now(),
//         players: [], // Empty array for players; this will be updated as players join
//         board: {
//           size: "13x13",
//           scarletArena: {
//             location: [6, 6],
//             status: "open"
//           },
//           quadrants: [
//             { id: 1, color: "Blue" },
//             { id: 2, color: "Green" },
//             { id: 3, color: "Violet" },
//             { id: 4, color: "Crimson" }
//           ],
//           specialSquares: {
//             sanctuaries: [{ location: [2, 2], status: "open" }],
//             qorinthPoolSquares: [{ location: [8, 8] }],
//             fateSquares: [{ location: [4, 4] }],
//             engagementSquares: [{ location: [10, 10] }]
//           }
//         },
//         movementDice: { dice1: 6, dice2: 6, doublesRolled: false },
//         legendaryAssassins: { available: ["Legendary Assassin 1", "Legendary Assassin 2"] },
//         resetTool: { status: "enabled", lastReset: null },
//         sessionStatus: "active"
//       };

//       // Store the session data in Firebase
//       await set(sessionRef, sessionData);
//       setSuccessMessage('Session Created Successfully!');
//       setError('');
//     } catch (error) {
//       setError('Failed to create session. Please try again.');
//       console.error('Failed to create session:', error);
//     }
//   };

//   return (
//     <ProtectedRoute>
//       {/* Parallax Background */}
//       <div className="parallax min-h-screen bg-fixed bg-center bg-cover" style={{ backgroundImage: 'url("/path/to/your/image.jpg")' }}>
        
//         {/* Top Header */}
//         <header className="bg-shadow-black text-ice-blue py-4 px-8 flex justify-between items-center max-w-4xl mx-auto">
//           <h1 className="text-3xl font-bold">Velatum Bellum</h1>
//           <button
//             onClick={() => auth.signOut()}
//             className="bg-blood-orange text-shadow-black px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black"
//           >
//             Logout
//           </button>
//         </header>

//         {/* Username and Dashboard Section */}
//         <div className="bg-smoke-gray py-4 px-8 text-center max-w-4xl mx-auto mt-4">
//           <h2 className="text-2xl font-semibold">
//             {userName ? `${userName}'s Dashboard` : 'Loading...'}
//           </h2>
//         </div>

//         {/* Main Content */}
//         <div className="flex flex-col items-center justify-center mt-8">
//           <div className="grid grid-cols-3 gap-8 mt-8">
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               Join a Game
//             </button>
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               Missions App
//             </button>
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               The Story
//             </button>
//           </div>

//           {/* Vault Keeper's Extra Form Section - Drop Down */}
//           {isVaultKeeper && (
//             <div className="w-full max-w-4xl mt-12">
//               {/* Toggle Button for Create a Session */}
//               <button
//                 className="bg-smoke-gray text-ice-blue w-full p-4 rounded-lg hover:bg-shadow-black flex justify-between items-center"
//                 onClick={() => setIsSessionSectionOpen(!isSessionSectionOpen)}
//               >
//                 <span className="text-2xl font-bold text-center w-full">Create a Game Session</span>
//                 <span>{isSessionSectionOpen ? '▲' : '▼'}</span>
//               </button>

//               {/* Session Form - Only show if the section is open */}
//               {isSessionSectionOpen && (
//                 <div className="p-6 mt-4 bg-shadow-black rounded-lg">
//                   {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
//                       <span>{error}</span>
//                     </div>
//                   )}
//                   {successMessage && (
//                     <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center" role="alert">
//                       <span>{successMessage}</span>
//                     </div>
//                   )}

//                   <div className="mb-4">
//                     <label className="block text-lg">Game Session Name</label>
//                     <input
//                       type="text"
//                       value={gameName}
//                       onChange={(e) => setGameName(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                       placeholder="Enter a unique session name"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-lg">Max Players</label>
//                     <select
//                       value={maxPlayers}
//                       onChange={(e) => setMaxPlayers(Number(e.target.value))}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value={2}>2</option>
//                       <option value={3}>3</option>
//                       <option value={4}>4</option>
//                       <option value={5}>5 (4 players + Vault Keeper)</option> {/* Ensuring 5 players max */}
//                     </select>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Game Type</label>
//                     <select
//                       value={gameType}
//                       onChange={(e) => setGameType(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value="Beginner">Beginner (Win 3 Status Stones)</option>
//                       <option value="Intermediate">Intermediate (Win 6 Status Stones)</option>
//                       <option value="Advanced">Advanced (Win 9 Status Stones)</option>
//                     </select>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Game Rounds</label>
//                     <select
//                       value={gameRounds}
//                       onChange={(e) => setGameRounds(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value="Best of 1">Best of 1</option>
//                       <option value="Best of 3">Best of 3</option>
//                     </select>
//                   </div>

//                   {/* Starting Hand and Blood Oath Stones (not editable) */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Starting Hand</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       6 Cards (5 Tactical Cards, 1 Power Card)
//                     </p>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-lg">Starting Blood Oath Stones</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       1 Stone (Auto-distributed)
//                     </p>
//                   </div>

//                   {/* Initial Mission Cards (auto-distributed) */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Initial Mission Cards</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       {Math.floor(60 / maxPlayers)} Mission Cards (Auto-distributed)
//                     </p>
//                   </div>

//                   {/* Turn Time Limit - Slider */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Turn Time Limit</label>
//                     <input
//                       type="range"
//                       min={60}
//                       max={120}
//                       step={10}
//                       value={turnTimeLimit}
//                       onChange={(e) => setTurnTimeLimit(Number(e.target.value))}
//                       className="w-full slider"
//                     />
//                     <div className="text-center mt-2 text-ice-blue">
//                       {turnTimeLimit} seconds
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Session Access Key</label>
//                     <input
//                       type="text"
//                       value={password}
//                       readOnly
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     />
//                   </div>

//                   <div className="flex justify-between">
//                     <button
//                       onClick={createSession}
//                       className="bg-blood-orange text-shadow-black p-2 rounded-lg hover:bg-ice-blue hover:text-shadow-black"
//                     >
//                       Create Session
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default DashboardPage;



// "use client";

// import { useState, useEffect } from 'react';
// import { auth } from '../../lib/firebaseConfig'; // Firebase config with Realtime Database
// import { useRouter } from 'next/navigation'; // For navigation on logout
// import { ref, set, get } from 'firebase/database'; // Firebase Database functions
// import { database } from '../../lib/firebaseConfig'; // Firebase config for database
// import ProtectedRoute from '../../components/ProtectedRoute'; // HOC for protected routes
// import Link from 'next/link'; // Import Link for navigation

// const DashboardPage = () => {
//   const [userName, setUserName] = useState('');
//   const [isVaultKeeper, setIsVaultKeeper] = useState(false); // To track if the user is VaultKeeper
//   const [gameName, setGameName] = useState(''); // Game session name input
//   const [maxPlayers, setMaxPlayers] = useState(2); // Max players dropdown
//   const [gameType, setGameType] = useState('Beginner'); // Game type
//   const [gameRounds, setGameRounds] = useState('Best of 1'); // Game rounds
//   const [turnTimeLimit, setTurnTimeLimit] = useState(60); // Turn time limit in seconds (slider)
//   const [password, setPassword] = useState(''); // Game session password
//   const [isSessionSectionOpen, setIsSessionSectionOpen] = useState(false); // To toggle session section
//   const router = useRouter(); // For handling navigation after logout

//   // Generate a random password
//   const generatePassword = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let newPassword = '';
//     for (let i = 0; i < 5; i++) {
//       newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setPassword(newPassword);
//   };

//   // Get the user's email from Firebase and derive the name
//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user && user.email) {
//       const emailName = user.email.split('@')[0] || ''; // Extract the part before '@'
//       setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1)); 

//       if (emailName.toLowerCase() === 'vaultkeeper') {
//         setIsVaultKeeper(true); // If the user is VaultKeeper, show extra options
//         generatePassword(); // Automatically generate the game session password
//       }
//     }
//   }, []);

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       router.push('/login'); // Redirect to login page after logout
//     } catch (error) {
//       console.error('Logout failed: ', error);
//     }
//   };

//   // Create session in Firebase Realtime Database

//   const createSession = async () => {
//     const sessionData = {
//       gameName,
//       maxPlayers: 5, // Set max players to 5 (4 players + 1 Vault Keeper)
//       gameType,
//       gameRounds,
//       startingHand: { tacticalCards: 5, powerCards: 1 },
//       startingBloodOathStones: 1,
//       initialMissionCards: Math.floor(60 / 4), // Distribute mission cards based on 4 players
//       turnTimeLimit,
//       password,
//       createdAt: Date.now(),
//       players: [], // Empty array for players; this will be updated as players join
//       board: {
//         size: "13x13",
//         scarletArena: { location: [6, 6], status: "open" },
//         quadrants: [
//           { id: 1, color: "Blue" },
//           { id: 2, color: "Green" },
//           { id: 3, color: "Violet" },
//           { id: 4, color: "Crimson" }
//         ],
//         specialSquares: {
//           sanctuaries: [{ location: [2, 2], status: "open" }],
//           qorinthPoolSquares: [{ location: [8, 8] }],
//           fateSquares: [{ location: [4, 4] }],
//           engagementSquares: [{ location: [10, 10] }]
//         }
//       },
//       movementDice: { dice1: 6, dice2: 6, doublesRolled: false },
//       legendaryAssassins: { available: ["Legendary Assassin 1", "Legendary Assassin 2"] },
//       resetTool: { status: "enabled", lastReset: null },
//       sessionStatus: "active"
//     };
  
//     // Store the session data in Firebase
//     try {
//       await set(ref(database, `gameSessions/${gameName}`), sessionData);
//       alert('Session Created Successfully!');
//     } catch (error) {
//       console.error('Failed to create session:', error);
//     }
//   };
  
//   return (
//     <ProtectedRoute>
//       {/* Parallax Background */}
//       <div className="parallax min-h-screen bg-fixed bg-center bg-cover" style={{ backgroundImage: 'url("/dashboard_background.png")' }}>
        
//         {/* Top Header */}
//         <header className="bg-shadow-black text-ice-blue py-4 px-8 flex justify-between items-center max-w-4xl mx-auto">
//           <h1 className="text-3xl font-bold">Velatum Bellum</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-blood-orange text-shadow-black px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black"
//           >
//             Logout
//           </button>
//         </header>

//         {/* Username and Dashboard Section */}
//         <div className="bg-smoke-gray py-4 px-8 text-center max-w-4xl mx-auto mt-4">
//           <h2 className="text-2xl font-semibold">
//             {userName ? `${userName}'s Dashboard` : 'Loading...'}
//           </h2>
//         </div>

//         {/* Main Content */}
//         <div className="flex flex-col items-center justify-center mt-8">
//           <div className="grid grid-cols-3 gap-8 mt-8">
//              {/* Link to Join a Game page */}
//           <Link href="/join-session">
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               Join a Game
//             </button>
//           </Link>
//             {/* <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               Join a Game
//             </button> */}
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               Missions App
//             </button>
//             <button className="bg-blood-orange text-shadow-black text-2xl px-10 py-8 rounded-lg hover:bg-ice-blue hover:text-shadow-black">
//               The Story
//             </button>
//           </div>

//           {/* Vault Keeper's Extra Form Section - Drop Down */}
//           {isVaultKeeper && (
//             <div className="w-full max-w-4xl mt-12">
//               {/* Toggle Button for Create a Session */}
//               <button
//                 className="bg-smoke-gray text-ice-blue w-full p-4 rounded-lg hover:bg-shadow-black flex justify-between items-center"
//                 onClick={() => setIsSessionSectionOpen(!isSessionSectionOpen)}
//               >
//                 <span className="text-2xl font-bold text-center w-full">Create a Game Session</span>
//                 <span>{isSessionSectionOpen ? '▲' : '▼'}</span>
//               </button>

//                             {/* Session Form - Only show if the section is open */}
//                             {isSessionSectionOpen && (
//                 <div className="p-6 mt-4 bg-shadow-black rounded-lg">
//                   <div className="mb-4">
//                     <label className="block text-lg">Game Session Name</label>
//                     <input
//                       type="text"
//                       value={gameName}
//                       onChange={(e) => setGameName(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                       placeholder="Enter a name for your game"
//                     />
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Max Players</label>
//                     <select
//                       value={maxPlayers}
//                       onChange={(e) => setMaxPlayers(Number(e.target.value))}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value={2}>2</option>
//                       <option value={3}>3</option>
//                       <option value={4}>4</option>
//                     </select>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Game Type</label>
//                     <select
//                       value={gameType}
//                       onChange={(e) => setGameType(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value="Beginner">Beginner (Win 3 Status Stones)</option>
//                       <option value="Intermediate">Intermediate (Win 6 Status Stones)</option>
//                       <option value="Advanced">Advanced (Win 9 Status Stones)</option>
//                     </select>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Game Rounds</label>
//                     <select
//                       value={gameRounds}
//                       onChange={(e) => setGameRounds(e.target.value)}
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     >
//                       <option value="Best of 1">Best of 1</option>
//                       <option value="Best of 3">Best of 3</option>
//                     </select>
//                   </div>

//                   {/* Starting Hand and Blood Oath Stones (not editable) */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Starting Hand</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       6 Cards (5 Tactical Cards, 1 Power Card)
//                     </p>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-lg">Starting Blood Oath Stones</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       1 Stone (Auto-distributed)
//                     </p>
//                   </div>

//                   {/* Initial Mission Cards (auto-distributed) */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Initial Mission Cards</label>
//                     <p className="p-2 bg-smoke-gray text-ice-blue rounded">
//                       {Math.floor(60 / maxPlayers)} Mission Cards (Auto-distributed)
//                     </p>
//                   </div>

//                   {/* Turn Time Limit - Slider */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Turn Time Limit</label>
//                     <input
//                       type="range"
//                       min={60}
//                       max={120}
//                       step={10}
//                       value={turnTimeLimit}
//                       onChange={(e) => setTurnTimeLimit(Number(e.target.value))}
//                       className="w-full slider"
//                     />
//                     <div className="text-center mt-2 text-ice-blue">
//                       {turnTimeLimit} seconds
//                     </div>
//                   </div>

//                   {/* Session Password */}
//                   <div className="mb-4">
//                     <label className="block text-lg">Session Password</label>
//                     <input
//                       type="text"
//                       value={password}
//                       readOnly
//                       className="w-full p-2 border rounded bg-smoke-gray text-ice-blue"
//                     />
//                   </div>

//                   {/* Save and Start Session Buttons */}
//                   <div className="flex justify-between">
//                     <button
//                       onClick={createSession}
//                       className="bg-blood-orange text-shadow-black p-2 rounded-lg hover:bg-ice-blue hover:text-shadow-black"
//                     >
//                       Save Session
//                     </button>
//                     <button
//                       onClick={createSession}
//                       className="bg-blood-orange text-shadow-black p-2 rounded-lg hover:bg-ice-blue hover:text-shadow-black"
//                     >
//                       Start Game Session
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default DashboardPage;


              
  // const createSession = async () => {
  //   const sessionId = gameName; // Use only the gameName as the session ID
  
  //   const sessionData = {
  //     gameName,
  //     maxPlayers,
  //     gameType,
  //     gameRounds,
  //     startingHand: { tacticalCards: 5, powerCards: 1 },
  //     startingBloodOathStones: 1,
  //     initialMissionCards: Math.floor(60 / maxPlayers),
  //     turnTimeLimit,
  //     password,
  //     createdAt: Date.now(),
  //     players: [], // Empty array for players; this will be updated as players join
  //     board: {
  //       size: "13x13",
  //       scarletArena: {
  //         location: [6, 6],
  //         status: "open",
  //       },
  //       quadrants: [
  //         { id: 1, color: "Blue" },
  //         { id: 2, color: "Green" },
  //         { id: 3, color: "Violet" },
  //         { id: 4, color: "Crimson" },
  //       ],
  //       specialSquares: {
  //         sanctuaries: [{ location: [2, 2], status: "open" }],
  //         qorinthPoolSquares: [{ location: [8, 8] }],
  //         fateSquares: [{ location: [4, 4] }],
  //         engagementSquares: [{ location: [10, 10] }],
  //       },
  //     },
  //     movementDice: {
  //       dice1: 6,
  //       dice2: 6,
  //       doublesRolled: false,
  //     },
  //     legendaryAssassins: {
  //       available: ["Legendary Assassin 1", "Legendary Assassin 2"],
  //     },
  //     resetTool: {
  //       status: "enabled",
  //       lastReset: null,
  //     },
  //     sessionStatus: "active",
  //   };
  
  //   // Check if the session already exists before creating a new one
  //   const dbRef = ref(database, `gameSessions/${sessionId}`);
  
  //   try {
  //     const snapshot = await get(dbRef);
  
  //     if (snapshot.exists()) {
  //       alert('Session with this name already exists. Please choose a different name.');
  //     } else {
  //       await set(dbRef, sessionData); // Save the session
  //       alert('Session Created Successfully!');
  //     }
  //   } catch (error) {
  //     console.error('Failed to create session:', error);
  //   }
  // };
  
  // const createSession = async () => {
  //   const sessionId = `${gameName}-${Date.now()}`; // Unique session ID
  //   const sessionData = {
  //     gameName,
  //     maxPlayers,
  //     gameType,
  //     gameRounds,
  //     startingHand: { tacticalCards: 5, powerCards: 1 },
  //     startingBloodOathStones: 1,
  //     initialMissionCards: Math.floor(60 / maxPlayers),
  //     turnTimeLimit,
  //     password,
  //     createdAt: Date.now(),
  //     players: [], // Empty array for players; this will be updated as players join
  //     board: {
  //       size: "13x13",
  //       scarletArena: {
  //         location: [6, 6],
  //         status: "open"
  //       },
  //       quadrants: [
  //         { id: 1, color: "Blue" },
  //         { id: 2, color: "Green" },
  //         { id: 3, color: "Violet" },
  //         { id: 4, color: "Crimson" }
  //       ],
  //       specialSquares: {
  //         sanctuaries: [{ location: [2, 2], status: "open" }],
  //         qorinthPoolSquares: [{ location: [8, 8] }],
  //         fateSquares: [{ location: [4, 4] }],
  //         engagementSquares: [{ location: [10, 10] }]
  //       }
  //     },
  //     movementDice: {
  //       dice1: 6,
  //       dice2: 6,
  //       doublesRolled: false
  //     },
  //     legendaryAssassins: {
  //       available: ["Legendary Assassin 1", "Legendary Assassin 2"]
  //     },
  //     resetTool: {
  //       status: "enabled",
  //       lastReset: null
  //     },
  //     sessionStatus: "active"
  //   };

  //   // Store the session data in Firebase
  //   try {
  //     await set(ref(database, `gameSessions/${sessionId}`), sessionData);
  //     alert('Session Created Successfully!');
  //   } catch (error) {
  //     console.error('Failed to create session:', error);
  //   }
  // };
