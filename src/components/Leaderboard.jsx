import React from 'react';
import { useElo } from '../context/EloContext';

export default function Leaderboard() {
  const { players } = useElo();

  const sortedPlayers = [...players].sort((a, b) => b.elo - a.elo);

  return (
    <div className="glass-panel animate-fade-in">
      <h2>Top Players</h2>
      {sortedPlayers.length === 0 ? (
        <p>No players yet. Go to the Players tab to add some!</p>
      ) : (
        <div className="flex-col">
          {sortedPlayers.map((player, index) => (
            <div key={player.id} className="flex-row space-between" style={{ 
              padding: '1rem', 
              background: index === 0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              border: index === 0 ? '1px solid rgba(251, 191, 36, 0.3)' : 'none'
            }}>
              <div className="flex-row">
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '30px', color: index === 0 ? '#fbbf24' : 'var(--text-secondary)' }}>
                  #{index + 1}
                </span>
                <span style={{ fontSize: '1.1rem' }}>{player.name}</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                {player.elo}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
