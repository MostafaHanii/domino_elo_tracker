import React, { useState } from 'react';
import { useElo } from '../context/EloContext';
import { Plus } from 'lucide-react';

export default function PlayerList() {
  const { players, addPlayer } = useElo();
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  return (
    <div className="glass-panel animate-fade-in">
      <h2>Player Management</h2>
      
      <form onSubmit={handleSubmit} className="flex-row mb-2">
        <input 
          type="text" 
          placeholder="Enter player name..." 
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-accent" style={{ whiteSpace: 'nowrap' }}>
          <Plus size={18} /> Add
        </button>
      </form>

      <div style={{ marginTop: '2rem' }}>
        <h3>Registered Players ({players.length})</h3>
        <div className="flex-col">
          {players.map((player) => (
            <div key={player.id} className="flex-row space-between" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <span>{player.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>Elo: {player.elo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
