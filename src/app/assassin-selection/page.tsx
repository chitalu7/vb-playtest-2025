"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ref, get, update } from 'firebase/database';
import { auth, database } from '../../lib/firebaseConfig'; // Firebase config
import Navbar from '../../components/Navbar'; // Navbar

// Define the Player type
interface Player {
  playerName: string;
  assassin: string;
  // Add other properties if needed
}

// Define the Character type
interface Character {
  name: string;
  house: string;
  age: number;
  drives: string[];
  image: string;
  crestImg: string;
  color: string;
  description: string;
  dbName: string; // Added dbName for each character
}

const AssassinSelectionContent = () => {
  const characters = [
    // House Captains
    { name: "Sterling Steele", dbName: "Sterling", house: "Azure Wolf", age: 42, ability: "Metal Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/azure_sterling_profile.webp", crestImg: "/crest_images/azure_wolf.webp", color: "#37499e", description: "Expert All-Round Dominance." },
    { name: "Chibale Mutale", dbName: "Chibale", house: "Emerald Lion", age: 40, ability: "Aethereal Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/emerald_chibale_profile.webp", crestImg: "/crest_images/emerald_lion.webp", color: "#007e51", description: "Expert Field Strategist." },
    { name: "Ikazuchi Takahashi", dbName: "Ikazuchi", house: "Violet Fox", age: 41, ability: "Storm Dominion", drives: ["AD1: Raigeki", "AD2: Boruto no Bōrei", "QoD: Raiden no Shinpan"], image: "/profile_images/violet_izakuchi_profile.webp", crestImg: "/crest_images/violet_fox.webp", color: "#603268", description: "Expert at Multi-Target Combat." },
    { name: "Nyx", dbName: "Nyx", house: "Crimson Serpent", age: 38, ability: "Telekinisis Dominon", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/crimson_nyx_profile.webp", crestImg: "/crest_images/crimson_serpent.webp", color: "#943126", description: "Expert at Environment Control." },

    // House Team Member A
    { name: "Maxime Fontaine", dbName: "Maxime", house: "Azure Wolf", age: 35, ability: "Spatial Dominion", drives: ["AD1: Blink Strike", "AD2: Vault Heist", "QoD: Quantum Leap"], image: "/profile_images/azure_maxime_profile_3.webp", crestImg: "/crest_images/azure_wolf.webp", color: "#37499e", description: "Expert Field Navigator." },
    { name: "Hassan Mustafa", dbName: "Hassan", house: "Emerald Lion", age: 40, ability: "Chronos Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/emerald_hassan_profile.webp", crestImg: "/crest_images/emerald_lion.webp", color: "#007e51", description: "Expert Foresight & Field Tactics." },
    { name: "Hyesoo Choi", dbName: "Hyesoo", house: "Violet Fox", age: 36, ability: "Telepathy Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/violet_hyesoo_profile.webp", crestImg: "/crest_images/violet_fox.webp", color: "#603268", description: "Expert Disruptor & Resource Acquisition." },
    { name: "Gideon Cole", dbName: "Gideon", house: "Crimson Serpent", age: 41, ability: "Gravity Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/crimson_gideon_profile.webp", crestImg: "/crest_images/crimson_serpent.webp", color: "#943126", description: "Expert at Enemy Field Displacement." },

    // House Team Member B
    { name: "Vira Shvets", dbName: "Vira", house: "Azure Wolf", age: 36, ability: "Venom Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/azure_vira_profile.webp", crestImg: "/crest_images/azure_wolf.webp", color: "#37499e", description: "Expert at Venoms & Toxins." },
    { name: "Samira Nassar", dbName: "Samira", house: "Emerald Lion", age: 38, ability: "Prism Dominion", drives: ["AD1: Prism Eye", "AD2: Mirror Gates", "QoD: Crystal Bullet"], image: "/profile_images/emerald_samira_profile.webp", crestImg: "/crest_images/emerald_lion.webp", color: "#007e51", description: "Expert at Ambush & Long-Range Assault." },
    { name: "Jinhei Wu", dbName: "Jinhei", house: "Violet Fox", age: 37, ability: "Technomancer Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/violet_jinhei_profile.webp", crestImg: "/crest_images/violet_fox.webp", color: "#603268", description: "Expert Technologist & Resource Acquisition." },
    { name: "Adrian Mendez", dbName: "Adrian", house: "Crimson Serpent", age: 36, ability: "Blood Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/crimson_adrian_profile.webp", crestImg: "/crest_images/crimson_serpent.webp", color: "#943126", description: "Expert Blood Contractor." },

    // Non-affiliated (Young Assassins)
    { name: "Róisín O'Leary", dbName: "Róisín", house: "Non-Affiliated", age: 17, ability: "Destruction Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/yna_róisín_profile.webp", crestImg: "/crest_images/non_affiliated.webp", color: "#636363", description: "Explosives specialist." },
    { name: "Mateo Santoro", dbName: "Mateo", house: "Non-Affiliated", age: 19, ability: "Pilot Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/yna_mateo_profile.webp", crestImg: "/crest_images/non_affiliated.webp", color: "#636363", description: "Expert Pilot & Driver." },
    { name: "Schvenn", dbName: "Schvenn", house: "Non-Affiliated", age: 18, ability: "Speed Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/yna_schvenn_profile.webp", crestImg: "/crest_images/non_affiliated.webp", color: "#636363", description: "Expert at Evasion & Mobility." },
    { name: "Ewa Nocna", dbName: "Ewa", house: "Non-Affiliated", age: 16, ability: "Luna Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/yna_ewa_profile.webp", crestImg: "/crest_images/non_affiliated.webp", color: "#636363", description: "Expert at Evasion & Tracking." },
  
    // Non-affiliated (Older Veteran Assassins)
    { name: "Yiska", dbName: "Yiska", house: "Non-Affiliated", age: 56, ability: "Spirit Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/ona_yiska_profile.webp", crestImg: "/crest_images/non_affiliated.webp", color: "black", description: "Expert at Evasion & Long-Range Assault." },
    { name: "Thyra", dbName: "Thyra", house: "Non-Affiliated", age: 57, ability: "Valor Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/ona_thyra_profile_2.webp", crestImg: "/crest_images/non_affiliated.webp", color: "black", description: "Expert at Aerial & Long-Range Assault." },
    { name: "Yetunde", dbName: "Yetunde", house: "Non-Affiliated", age: 58, ability: "Earth Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/ona_yetunde_profile.webp", crestImg: "/crest_images/non_affiliated.webp", color: "black", description: "Expert at Defense & Regeneration." },
    { name: "Oslvaldo", dbName: "Osvaldo", house: "Non-Affiliated", age: 60, ability: "Death Dominion", drives: ["AD1", "AD2", "Prime"], image: "/profile_images/ona_osvaldo_profile.webp", crestImg: "/crest_images/non_affiliated.webp", color: "black", description: "Expert at Stealth." }
       
  ];

  const [hoveredCharacter, setHoveredCharacter] = useState<Character | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams(); // Fetch session name from query params
  const sessionName = searchParams.get('sessionName');

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!sessionName) return;
      const sessionRef = ref(database, `gameSessions/${sessionName}`);
      const sessionSnapshot = await get(sessionRef);
      if (sessionSnapshot.exists()) {
        const sessionData = sessionSnapshot.val();
        setPlayers(sessionData.players || []);
      }
    };
    fetchPlayers();
  }, [sessionName]);

  const handleAssassinSelection = async () => {
    if (!selectedCharacter) {
      setError('No character selected');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('You need to be logged in to select an assassin');
        return;
      }

      const playerName = user.email?.split('@')[0];
      const sessionRef = ref(database, `gameSessions/${sessionName}`);
      const sessionSnapshot = await get(sessionRef);
      const sessionData = sessionSnapshot.val();
      const players = sessionData.players || [];

      // Find the player in the session
      const existingPlayer = players.find((player: Player) => player.playerName === playerName);

      if (existingPlayer) {
        existingPlayer.assassin = selectedCharacter.dbName;
      } else {
        players.push({
          playerName,
          assassin: selectedCharacter.dbName,
          cards: {
            entryMissionCards: 0,
            tacticalCards: 5,
            powerCards: 1
          },
          props: {
            bloodOathStones: 1,
            statusStones: 0,
            silverCoins: 5
          }
        });
      }

      // Update session with the new player/assassin data
      await update(sessionRef, { players });

      // Navigate to the LiveGame page with the sessionName
      router.push(`/live-game?sessionName=${sessionName}`);
    } catch (error) {
      console.error('Failed to select assassin:', error);
      setError('Error selecting assassin');
    }
  };

  const handleCancelSelection = () => {
    setSelectedCharacter(null);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Player List Section */}
      <div className="py-8 px-4">
        <h2 className="text-3xl font-bold text-center text-ice-blue mb-6">Players in Session</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {players.map((player, index) => (
            <div
              key={index}
              className="bg-shadow-black text-ice-blue p-4 rounded-lg shadow-md w-60 text-center"
            >
              <h3 className="text-xl font-semibold">{player.playerName}</h3>
              {player.assassin ? (
                <p className="text-sm mt-2 text-blood-orange font-bold">Assassin: {player.assassin}</p>
              ) : (
                <p className="text-sm mt-2 text-gray-400">No Assassin selected yet</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex justify-between max-w-7xl mx-auto px-8 py-6"
        onMouseLeave={() => setHoveredCharacter(null)} // Clear hovered character when moving away from the grid
      >
        {/* Left Column: Hovered or Selected Character Profile */}
        <div
          className="w-1/3 p-4 rounded-lg text-ice-blue mr-8"
          style={{ backgroundColor: hoveredCharacter?.color || selectedCharacter?.color || "#505a5b" }} // Use the character's color for background
        >
          {(hoveredCharacter || selectedCharacter) ? (
            <div className="text-center">
              {/* Larger Circular Character Image */}
              <img
                src={(hoveredCharacter || selectedCharacter)?.image}
                alt={(hoveredCharacter || selectedCharacter)?.name}
                className="w-56 h-56 rounded-full mx-auto mb-4 shadow-lg"
              />
              <h3 className="text-2xl font-semibold">{(hoveredCharacter || selectedCharacter)?.name}</h3>

              {/* Smaller Crest Image and House Name */}
              <div className="flex justify-center items-center mb-4">
                <img
                  src={(hoveredCharacter || selectedCharacter)?.crestImg}
                  alt={(hoveredCharacter || selectedCharacter)?.house + ' crest'}
                  className="w-16 h-16 mr-4 shadow-lg"
                />
                <p className="text-xl font-bold"> {(hoveredCharacter || selectedCharacter)?.house}</p>
              </div>

              <p className="text-base font-semibold text-gray-300">{(hoveredCharacter || selectedCharacter)?.description}</p>

              {/* Drives Section */}
              <div className="mt-4">
                <h4 className="text-xl font-bold text-ice-blue">Drives</h4>
                <ul className="list-none list-inside text-sm text-gray-300">
                  {(hoveredCharacter || selectedCharacter)?.drives.map((drive, idx) => (
                    <li key={idx}><p className='text-base'>{drive}</p></li>
                  ))}
                </ul>
              </div>

              {/* Confirmation Button */}
              {selectedCharacter && (
                <>
                  <button
                    onClick={handleAssassinSelection}
                    className="mt-4 bg-blood-orange text-shadow-black px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black"
                  >
                    Confirm Selection
                  </button>
                  {/* Cancel Button */}
                  <button
                    onClick={handleCancelSelection}
                    className="mt-4 ml-2 bg-gray-500 text-shadow-black px-4 py-2 rounded hover:bg-ice-blue hover:text-shadow-black"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-300">
              <h2 className="text-2xl font-semibold">Character Select</h2>
              <p className="text-sm">Hover over or select a character to see details.</p>
            </div>
          )}
        </div>

        {/* Right Column: Character Grid */}
        <div className="w-2/3 grid grid-cols-4 gap-2"> {/* Set gap between squares */}
          {characters.map((character: Character, index: number) => (
            <div
              key={index}
              className="text-center text-white rounded-lg cursor-pointer transition-transform transform hover:scale-105"
              onMouseEnter={() => setHoveredCharacter(character)}
              onMouseLeave={() => setHoveredCharacter(null)} // Reset hover effect when leaving a character
              onClick={() => setSelectedCharacter(character)}
              style={{
                backgroundColor: selectedCharacter?.name === character.name ? "#f3b481" : "#505a5b",
                width: '80%',
                height: '120px',
                margin: '0',
                boxSizing: 'border-box',
                outline: selectedCharacter?.name === character.name ? '4px solid #f3b481' : 'none' // Add outline if selected
              }}
            >
              <img src={character.image} alt={character.name} className="w-full h-full object-cover rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Display error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
const AssassinSelection = () => (
  <Suspense fallback={<div className="flex items-center justify-center h-screen"><p className="text-2xl text-gray-600">Loading...</p></div>}>
    <AssassinSelectionContent />
  </Suspense>
);

export default AssassinSelection;
