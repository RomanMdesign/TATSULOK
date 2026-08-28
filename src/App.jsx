import React, { useState, useEffect } from 'react';
import { CHARACTERS, FACTIONS } from './game/characters.js';
import { MISSIONS } from './game/MissionSystem.js';
import District3D from './game/District3D.jsx';

export default function App() {
  const [gameState, setGameState] = useState('LOBBY'); // LOBBY, SELECTION, DOSSIER, GAME, EVENT, MISSION_CLEAR
  const [playerName, setPlayerName] = useState(localStorage.getItem('tatsulok_name') || '');
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);
  const [isReady, setIsReady] = useState(false);
  
  // Mission Tracking
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(0);
  const [currentObjIndex, setCurrentObjIndex] = useState(0);
  const [isInteriorMode, setIsInteriorMode] = useState(false);

  const activeMission = MISSIONS[selectedMissionIndex];
  const activeObjective = activeMission.objectives[currentObjIndex];

  // Player Position State
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 0 });

  const targetCoords = isInteriorMode && activeObjective.interiorPos 
    ? activeObjective.interiorPos 
    : activeObjective.location;

  const distanceToObjective = Math.round(
    Math.sqrt(
      Math.pow(playerPos.x - targetCoords.x, 2) +
      Math.pow(playerPos.z - targetCoords.z, 2)
    )
  );

  useEffect(() => {
    if (playerName) localStorage.setItem('tatsulok_name', playerName);
  }, [playerName]);

  // Movement Controls
  const movePlayer = (dx, dz) => {
    setPlayerPos((prev) => ({ x: prev.x + dx, z: prev.z + dz }));
  };

  const handleInteract = () => {
    if (distanceToObjective <= 5) {
      if (activeObjective.isInterior && !isInteriorMode) {
        // Pumasok sa loob ng gusali
        setIsInteriorMode(true);
        setPlayerPos({ x: 0, z: 10 });
      } else {
        setGameState('EVENT');
      }
    }
  };

  const handleChoiceSelect = (choice) => {
    alert(choice.text);
    
    // Lumabas mula sa interior kung kinakailangan
    if (isInteriorMode) {
      setIsInteriorMode(false);
      setPlayerPos({ x: activeObjective.location.x, z: activeObjective.location.z + 3 });
    }

    // Lumipat sa susunod na Objective o Misyon
    if (currentObjIndex < activeMission.objectives.length - 1) {
      setCurrentObjIndex(currentObjIndex + 1);
      setGameState('GAME');
    } else {
      setGameState('MISSION_CLEAR');
    }
  };

  return (
    <div className="w-screen h-screen bg-black text-white font-sans overflow-hidden select-none relative">
      
      {/* 1. LOBBY & MISSION SELECTOR */}
      {gameState === 'LOBBY' && (
        <div className="flex flex-col items-center justify-center h-full space-y-6 bg-gradient-to-b from-gray-900 via-black to-gray-950 p-4">
          <h1 className="text-6xl font-black tracking-widest text-red-600 drop-shadow-md">🔺 TATSULOK</h1>
          <p className="text-gray-400 italic max-w-md text-center">
            "Ang Tatsulok ay hindi lang laban ng lakas — laban din ito ng paninindigan."
          </p>
          
          <input
            type="text"
            placeholder="Ipasok ang iyong Pangalan"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-red-900 rounded text-center w-64 focus:outline-none focus:border-red-500"
          />

          {/* Mission Selector Dropdown */}
          <div className="flex flex-col items-center space-y-2">
            <label className="text-xs text-yellow-500 font-bold">PILIIN ANG MISYON:</label>
            <select
              value={selectedMissionIndex}
              onChange={(e) => {
                setSelectedMissionIndex(Number(e.target.value));
                setCurrentObjIndex(0);
              }}
              className="bg-gray-800 border border-gray-700 px-4 py-2 rounded text-sm text-yellow-400 font-bold focus:outline-none"
            >
              {MISSIONS.map((m, idx) => (
                <option key={m.id} value={idx}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => setGameState('SELECTION')}
              className="px-6 py-2 bg-red-800 hover:bg-red-700 font-bold rounded shadow transition"
            >
              PILIIN ANG KARAKTER
            </button>
            <button 
              disabled={!playerName || !isReady}
              onClick={() => {
                setPlayerPos({ x: 0, z: 0 });
                setIsInteriorMode(false);
                setGameState('GAME');
              }}
              className={`px-6 py-2 font-bold rounded shadow transition ${
                playerName && isReady ? 'bg-yellow-600 hover:bg-yellow-500 cursor-pointer' : 'bg-gray-700 cursor-not-allowed opacity-50'
              }`}
            >
              SIMULAN ANG MISYON
            </button>
          </div>
        </div>
      )}

      {/* 2. CHARACTER SELECTION & DOSSIER */}
      {(gameState === 'SELECTION' || gameState === 'DOSSIER') && (
        <div className="flex flex-col h-full bg-gray-950 p-6">
          <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
            <button 
              onClick={() => setGameState('LOBBY')}
              className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded"
            >
              ← BACK TO LOBBY
            </button>
            <h2 className="text-xl font-bold tracking-wider text-yellow-500">
              {gameState === 'SELECTION' ? 'CHARACTER SELECTION' : 'DOSSIER SYSTEM'}
            </h2>
            <button 
              onClick={() => { setIsReady(true); setGameState('LOBBY'); }}
              className={`px-4 py-1 rounded font-bold ${isReady ? 'bg-green-600' : 'bg-red-700'}`}
            >
              {isReady ? 'READY ✓' : 'SET READY'}
            </button>
          </div>

          {gameState === 'SELECTION' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto flex-1 p-2">
              {CHARACTERS.map((char) => (
                <div 
                  key={char.id}
                  onClick={() => { setSelectedChar(char); setGameState('DOSSIER'); }}
                  className={`border p-3 rounded cursor-pointer transition flex flex-col items-center bg-gray-900 hover:border-yellow-500 ${
                    selectedChar.id === char.id ? 'border-yellow-500' : 'border-gray-800'
                  }`}
                >
                  <img 
                    src={char.image} 
                    alt={char.name} 
                    className="w-24 h-24 object-cover rounded mb-2 border border-gray-700"
                  />
                  <h3 className="font-bold text-white">{char.name}</h3>
                  <span className="text-xs font-semibold mt-1 px-2 py-0.5 rounded" style={{ backgroundColor: FACTIONS[char.faction].color }}>
                    {char.faction}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col md:flex-row flex-1 bg-gray-900 border border-gray-800 rounded p-6 gap-6">
              <div className="w-full md:w-1/3 bg-gray-950 border border-gray-800 rounded overflow-hidden flex items-center justify-center h-64 md:h-auto">
                <img 
                  src={selectedChar.image} 
                  alt={selectedChar.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-black text-white">{selectedChar.name}</h2>
                <p className="text-sm font-semibold text-yellow-500">{selectedChar.role}</p>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><strong>Faction:</strong> {selectedChar.faction}</p>
                  <p><strong>Lakas:</strong> {selectedChar.power}</p>
                  <p><strong>Simbolo:</strong> {selectedChar.symbol}</p>
                  <p className="border-t border-gray-800 pt-2">{selectedChar.description}</p>
                </div>
                <button 
                  onClick={() => setGameState('SELECTION')} 
                  className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-bold"
                >
                  ← PALITAN ANG KARAKTER
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. 3D GAMEPLAY HUD */}
      {gameState === 'GAME' && (
        <div className="w-full h-full relative">
          <District3D 
            playerPos={playerPos} 
            targetPos={targetCoords}
            isInterior={isInteriorMode}
          />

          {/* HUD Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            <div className="bg-black/80 border border-gray-800 p-3 rounded pointer-events-auto">
              <p className="text-xs text-gray-400">PLAYER: <span className="text-white font-bold">{playerName}</span></p>
              <p className="text-xs text-gray-400">KARAKTER: <span className="text-yellow-500 font-bold">{selectedChar.name}</span></p>
              <p className="text-xs text-red-500 font-bold mt-1">{activeMission.title}</p>
            </div>
            
            <button 
              onClick={() => setGameState('LOBBY')}
              className="bg-red-900/80 hover:bg-red-800 text-xs px-3 py-2 rounded border border-red-700 pointer-events-auto"
            >
              ← LOBBY
            </button>
          </div>

          {/* Objective Tracker UI */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-yellow-600/50 px-6 py-2 rounded text-center pointer-events-none">
            <p className="text-xs text-gray-400 font-bold">OBJECTIVE {currentObjIndex + 1} / {activeMission.objectives.length}</p>
            <p className="text-sm font-bold text-yellow-400">★ {activeObjective.title}</p>
            <p className="text-xl font-black">{distanceToObjective}m</p>
            {isInteriorMode && <span className="text-xs text-green-400">[ NASA LOOB NG GUSALI ]</span>}
          </div>

          {/* Touch / Keyboard Movement Controls */}
          <div className="absolute bottom-6 left-6 grid grid-cols-3 gap-2 w-36 h-36">
            <div />
            <button onClick={() => movePlayer(0, -2)} className="bg-gray-800/80 border border-gray-600 rounded font-bold active:bg-red-700">W</button>
            <div />
            <button onClick={() => movePlayer(-2, 0)} className="bg-gray-800/80 border border-gray-600 rounded font-bold active:bg-red-700">A</button>
            <button onClick={() => movePlayer(0, 2)} className="bg-gray-800/80 border border-gray-600 rounded font-bold active:bg-red-700">S</button>
            <button onClick={() => movePlayer(2, 0)} className="bg-gray-800/80 border border-gray-600 rounded font-bold active:bg-red-700">D</button>
          </div>

          {/* Interact Button */}
          {distanceToObjective <= 5 && (
            <button 
              onClick={handleInteract}
              className="absolute bottom-10 right-10 bg-yellow-500 text-black font-black px-8 py-4 rounded-lg text-lg animate-bounce border-2 border-white shadow-lg"
            >
              {activeObjective.isInterior && !isInteriorMode ? '[ PUMASOK SA GUSALI ]' : '[ INTERACT ]'}
            </button>
          )}
        </div>
      )}

      {/* 4. MISSION EVENT / CHOICE DIALOGUE */}
      {gameState === 'EVENT' && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 border border-yellow-600 max-w-lg w-full p-6 rounded space-y-6">
            <h3 className="text-xl font-bold text-yellow-500 border-b border-gray-800 pb-2">MISSION EVENT</h3>
            <p className="text-gray-200">{activeObjective.text}</p>
            
            <div className="space-y-3">
              {activeObjective.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoiceSelect(choice)}
                  className="w-full text-left bg-gray-800 hover:bg-yellow-600 hover:text-black p-3 rounded font-bold text-sm border border-gray-700 transition"
                >
                  [ {choice.label} ]
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. MISSION CLEAR SCREEN */}
      {gameState === 'MISSION_CLEAR' && (
        <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 z-50 space-y-6">
          <h2 className="text-4xl font-black text-yellow-500 tracking-wider">MISYON KUMPLETO!</h2>
          <p className="text-gray-300 text-center max-w-md">
            Matagumpay mong natapos ang lahat ng 4 na objectives para sa <span className="text-white font-bold">{activeMission.title}</span>.
          </p>
          <button 
            onClick={() => {
              setCurrentObjIndex(0);
              setGameState('LOBBY');
            }}
            className="px-8 py-3 bg-red-800 hover:bg-red-700 rounded font-bold"
          >
            BUMALIK SA LOBBY
          </button>
        </div>
      )}

    </div>
  );
}
