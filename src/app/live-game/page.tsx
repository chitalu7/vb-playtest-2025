"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ref, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '../../lib/firebaseConfig';
import Navbar from '../../components/Navbar';

interface Player {
  playerName: string;
  assassin: string;
}

const LiveGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionName = searchParams.get('sessionName');

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const playerName = user.email?.split('@')[0];

      try {
        const sessionRef = ref(database, `gameSessions/${sessionName}/players`);

        // Listen for real-time changes to the players node
        const unsubscribePlayers = onValue(sessionRef, (snapshot) => {
          const playersData = snapshot.val();
          if (playersData) {
            const playersArray = Object.values(playersData) as Player[];
            setPlayers(playersArray);

            // Update current player if it matches the logged-in user
            const current = playersArray.find((p: Player) => p.playerName === playerName);
            setCurrentPlayer(current || null);
          }
        });

        return () => unsubscribePlayers(); // Unsubscribe from the listener when the component unmounts
      } catch (error) {
        console.error("Error fetching session data:", error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth(); // Unsubscribe from auth state changes when the component unmounts
  }, [sessionName, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl text-gray-600">Loading game...</p>
      </div>
    );
  }

  if (!currentPlayer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl text-gray-600">Player not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <header className="bg-blood-orange py-4">
        <h1 className="text-3xl font-bold text-center text-shadow-black">
          Live Game Session: {sessionName}
        </h1>
      </header>

      <main className="py-8 px-4 max-w-7xl mx-auto">
        {/* Current Player Info */}
        <div className="bg-smoke-gray p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-shadow-black">
            Welcome, {currentPlayer.playerName}
          </h2>
          <p className="text-lg text-ice-blue">
            You have chosen: <strong>{currentPlayer.assassin}</strong>
          </p>
        </div>

        {/* Player List */}
        <div className="grid grid-cols-4 gap-4">
          {players.map((player, index) => (
            <div
              key={index}
              className="bg-shadow-black text-ice-blue p-4 rounded-lg shadow-md text-center"
            >
              <h3 className="text-xl font-semibold">{player.playerName}</h3>
              <p className="text-sm mt-2">
                Assassin: <span className="text-blood-orange font-bold">{player.assassin}</span>
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LiveGame;


// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { ref, onValue, get } from 'firebase/database';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth, database } from '../../lib/firebaseConfig'; // Firebase config
// import Navbar from '../../components/Navbar'; // Navbar component

// interface Player {
//   playerName: string;
//   assassin: string;
// }

// const LiveGame = () => {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const sessionName = searchParams.get('sessionName');

//   useEffect(() => {
//     // Listen for changes in the authentication state
//     const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         // Redirect to login if no user is found
//         router.push('/login');
//         return;
//       }

//       const playerName = user.email?.split('@')[0]; // Extract the part of the email before '@'

//       // Fetch players data and listen for real-time updates
//       try {
//         const sessionRef = ref(database, `gameSessions/${sessionName}/players`);

//         // Listen for real-time updates on the players data
//         const unsubscribePlayers = onValue(sessionRef, (snapshot) => {
//           const playersData = snapshot.val();
//           if (playersData) {
//             const playersArray = Object.values(playersData) as Player[];
//             setPlayers(playersArray);

//             // Set the current player based on logged-in user
//             const player = playersArray.find((p: Player) => p.playerName === playerName);
//             setCurrentPlayer(player || null);
//           }
//         });

//         return () => unsubscribePlayers(); // Clean up listener when component unmounts
//       } catch (error) {
//         console.error("Error fetching session data:", error);
//         router.push('/'); // Redirect to home on error
//       } finally {
//         setLoading(false); // Set loading to false once data is fetched
//       }
//     });

//     return () => unsubscribeAuth(); // Clean up the auth listener
//   }, [sessionName, router]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-2xl text-gray-600">Loading game...</p>
//       </div>
//     );
//   }

//   if (!currentPlayer) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-2xl text-gray-600">Player not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Navbar />

//       {/* Game Header */}
//       <header className="bg-blood-orange py-4">
//         <h1 className="text-3xl font-bold text-center text-shadow-black">
//           Live Game Session: {sessionName}
//         </h1>
//       </header>

//       <main className="py-8 px-4 max-w-7xl mx-auto">
//         {/* Current Player Info */}
//         <div className="bg-smoke-gray p-6 rounded-lg mb-6">
//           <h2 className="text-2xl font-bold text-shadow-black">Welcome, {currentPlayer.playerName}</h2>
//           <p className="text-lg text-ice-blue">
//             You have chosen: <strong>{currentPlayer.assassin}</strong>
//           </p>
//         </div>

//         {/* Player List */}
//         <div className="grid grid-cols-4 gap-4">
//           {players.map((player, index) => (
//             <div
//               key={index}
//               className="bg-shadow-black text-ice-blue p-4 rounded-lg shadow-md text-center"
//             >
//               <h3 className="text-xl font-semibold">{player.playerName}</h3>
//               <p className="text-sm mt-2">
//                 Assassin: <span className="text-blood-orange font-bold">{player.assassin}</span>
//               </p>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default LiveGame;


