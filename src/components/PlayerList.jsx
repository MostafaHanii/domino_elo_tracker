import React, { useState } from 'react';
import { useElo } from '../context/EloContext';
import { Plus } from 'lucide-react';

export default function PlayerList() {
  const { players, addPlayer, editPlayer } = useElo();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handleEditSubmit = (e, id) => {
    e.preventDefault();
    if (editingName.trim()) {
      editPlayer(id, editingName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="glass-panel animate-fade-in">
      <h2>Player Management</h2>
      
      <form onSubmit={handleSubmit} className="flex-row mb-2">
        <input 
          type="text" 
          placeholder="Enter new player name..." 
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
              {editingId === player.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, player.id)} style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                  <input 
                    type="text" 
                    value={editingName} 
                    onChange={(e) => setEditingName(e.target.value)} 
                    autoFocus 
                    style={{ padding: '0.25rem 0.5rem' }}
                  />
                  <button type="submit" className="btn btn-accent" style={{ padding: '0.25rem 0.75rem' }}>Save</button>
                  <button type="button" className="btn" style={{ padding: '0.25rem 0.75rem', background: 'transparent', border: '1px solid var(--text-secondary)' }} onClick={() => setEditingId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <div className="flex-row">
                    <span>{player.name}</span>
                    <button 
                      onClick={() => { setEditingId(player.id); setEditingName(player.name); }} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                      title="Edit Player"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                  </div>
                  <span style={{ color: 'var(--text-secondary)' }}>Elo: {player.elo}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
