"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ref, update, get } from 'firebase/database';
import { auth, database } from '../../lib/firebaseConfig'; // Firebase auth and database config

const AssassinSelection = () => {
  const [selectedAssassin, setSelectedAssassin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionName = searchParams.get('sessionName');

  const handleAssassinSelection = async () => {
    if (!selectedAssassin) {
      setError('Please select an assassin');
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        setError('You need to be logged in to select an assassin');
        return;
      }

      const playerName = user.email?.split('@')[0]; // Extract the part of the email before '@'
      const sessionRef = ref(database, `gameSessions/${sessionName}`);

      // Get session data
      const sessionSnapshot = await get(sessionRef);
      if (!sessionSnapshot.exists()) {
        setError('Session not found');
        return;
      }

      const sessionData = sessionSnapshot.val();
      const players = sessionData.players || [];

      // Add player to the session with selected assassin
      players.push({
        playerName,
        assassin: selectedAssassin,
        cards: {
          entryMissionCards: 0, // Auto-distributed later
          tacticalCards: 5,
          powerCards: 1
        },
        props: {
          bloodOathStones: 1,
          statusStones: 0,
          silverCoins: 5
        }
      });

      await update(sessionRef, { players });

      // Redirect to game interface after selection
      router.push(`/game?sessionName=${sessionName}`);
    } catch (error) {
      console.error('Failed to select assassin:', error);
      setError('Error selecting assassin');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-shadow-black">
      <div className="bg-smoke-gray p-8 rounded shadow-md w-full max-w-md text-ice-blue">
        <h2 className="text-2xl font-bold mb-6 text-center">Select Your Assassin</h2>

        {/* Display error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
            {error}
          </div>
        )}

        <div className="mb-4">
          {/* Example assassin choices - Update with actual options */}
          <label className="block text-lg">Assassin</label>
          <select
            value={selectedAssassin}
            onChange={(e) => setSelectedAssassin(e.target.value)}
            className="w-full p-2 border rounded bg-shadow-black text-ice-blue"
          >
            <option value="">Select an Assassin</option>
            <option value="Assassin 1">Assassin 1</option>
            <option value="Assassin 2">Assassin 2</option>
            <option value="Assassin 3">Assassin 3</option>
          </select>
        </div>

        {/* Submit button */}
        <button
          onClick={handleAssassinSelection}
          className="w-full bg-blood-orange text-shadow-black p-2 rounded hover:bg-ice-blue hover:text-shadow-black"
        >
          Select Assassin
        </button>
      </div>
    </div>
  );
};

export default AssassinSelection;
