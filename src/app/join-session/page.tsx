"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ref, get, update } from 'firebase/database';
import { auth, database } from '../../lib/firebaseConfig'; // Firebase config for database
import Navbar from '../../components/Navbar'; // Import the Navbar

// Define the Player type
interface Player {
  playerName: string;
  joinedAt: number; // Timestamp of when the player joined
}

const JoinSessionPage = () => {
  const [sessionName, setSessionName] = useState('');
  const [sessionAccessKey, setSessionAccessKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // Clear form when the page loads
  useEffect(() => {
    setSessionName(''); // Clear session name
    setSessionAccessKey(''); // Clear session access key
  }, []);

  // Handle joining the session
  const handleJoinSession = async () => {
    if (!sessionName || !sessionAccessKey) {
      setErrorMessage('Both fields are required');
      return;
    }

    try {
      const sessionRef = ref(database, `gameSessions/${sessionName}`);
      const sessionSnapshot = await get(sessionRef);

      if (!sessionSnapshot.exists()) {
        setErrorMessage('Session not found');
        return;
      }

      const sessionData = sessionSnapshot.val();
      const players: Player[] = sessionData.players || []; // Cast players to Player[] type

      // Check if max players (5) are already in the session
      if (players.length >= 5) {
        setErrorMessage('Session is full. Maximum of 5 players allowed.');
        return;
      }

      const user = auth.currentUser;
      if (user) {
        const playerName = user.email?.split('@')[0] || ''; // Extract player name from email

        // Check if the player already exists in the session
        const existingPlayer = players.find((player) => player.playerName === playerName);

        if (!existingPlayer) {
          // Player does not exist, add them to the session
          players.push({
            playerName,
            joinedAt: Date.now(),
          });

          // Update Firebase with new player list
          await update(sessionRef, { players });
        }

        // Redirect to assassin selection after successful validation
        router.push(`/assassin-selection?sessionName=${sessionName}`);
      }
    } catch (error) {
      console.error('Error joining session:', error);
      setErrorMessage('Failed to join session. Please try again.');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
        <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
          <h2 className="text-2xl font-bold mb-6 text-center">Join a Game Session</h2>

          {/* Display error message */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
              {errorMessage}
            </div>
          )}

          {/* Session Name */}
          <div className="mb-4">
            <label className="block text-lg">Session Name</label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full p-2 border rounded bg-shadow-black text-ice-blue text-center" // Centered text
              placeholder="Enter Session Name"
            />
          </div>

          {/* Session Access Key */}
          <div className="mb-4">
            <label className="block text-lg">Session Access Key</label>
            <input
              type="password"
              value={sessionAccessKey}
              onChange={(e) => setSessionAccessKey(e.target.value)}
              className="w-full p-2 border rounded bg-shadow-black text-ice-blue text-center" // Centered text
              placeholder="Enter Session Key"
            />
          </div>

          {/* Join Session Button */}
          <button
            onClick={handleJoinSession}
            className="w-full bg-blood-orange text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
          >
            Join Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinSessionPage;

