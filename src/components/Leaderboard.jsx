import React, { useState } from 'react';
import { useElo } from '../context/EloContext';
import { Trophy } from 'lucide-react';
import PlayerProfileModal from './PlayerProfileModal';

export default function Leaderboard() {
  const { players, activeGame } = useElo();
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const getRating = (player) => player.ratings?.[activeGame] || player.elo || 1200;

  const sortedPlayers = [...players].sort((a, b) => getRating(b) - getRating(a));

  return (
    <div className="glass-panel animate-fade-in">
      <h2>Top Players</h2>
      {sortedPlayers.length === 0 ? (
        <p>No players yet. Go to the Players tab to add some!</p>
      ) : (
        <div className="flex-col">
          {sortedPlayers.map((player, index) => (
            <div key={player.id} className="flex-row space-between" onClick={() => setSelectedPlayer(player)} style={{ 
              padding: '0.75rem', 
              background: index === 0 ? 'rgba(251, 146, 60, 0.1)' : 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              border: index === 0 ? '1px solid rgba(251, 146, 60, 0.3)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              <div className="flex-row">
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '30px', color: index === 0 ? '#fbbf24' : 'var(--text-secondary)' }}>
                  #{index + 1}
                </span>
                <span style={{ fontWeight: '600' }}>{player.name}</span>
              </div>
              <span style={{ 
                fontWeight: 'bold', 
                color: index === 0 ? '#fbbf24' : 'var(--text-primary)',
                fontSize: '1.1rem'
              }}>
                {getRating(player)}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {selectedPlayer && (
        <PlayerProfileModal 
          player={selectedPlayer} 
          onClose={() => setSelectedPlayer(null)} 
        />
      )}
    </div>
  );
}
