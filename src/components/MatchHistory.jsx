import React, { useState } from 'react';
import { useElo } from '../context/EloContext';
import { Undo2, Info } from 'lucide-react';
import MatchDetailsModal from './MatchDetailsModal';

export default function MatchHistory() {
  const { matches, players, undoLastMatch } = useElo();
  const [selectedMatch, setSelectedMatch] = useState(null);

  const getPlayerName = (id) => {
    const player = players.find(p => p.id === id);
    return player ? player.name : 'Unknown';
  };

  return (
    <div className="glass-panel animate-fade-in">
      <div className="flex-row space-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Match History</h2>
        {matches.length > 0 && (
          <button onClick={undoLastMatch} className="btn" style={{ background: 'transparent', border: '1px solid var(--text-secondary)', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
            <Undo2 size={16} /> Undo Last Match
          </button>
        )}
      </div>
      {matches.length === 0 ? (
        <p>No matches recorded yet.</p>
      ) : (
        <div className="flex-col">
          {matches.map((match) => (
            <div 
              key={match.id} 
              onClick={() => setSelectedMatch(match)}
              style={{ 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '8px',
                borderLeft: `4px solid ${match.winning_team === 'A' ? '#3b82f6' : '#10b981'}`,
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <div className="flex-row space-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {new Date(match.created_at).toLocaleDateString()}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ±{match.elo_change} Elo <Info size={14} style={{ opacity: 0.7 }} />
                </span>
              </div>
              <div className="flex-col" style={{ gap: '0.25rem' }}>
                <div style={{ color: match.winning_team === 'A' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  <strong>Team A:</strong> {getPlayerName(match.team_a_player1_id)} & {getPlayerName(match.team_a_player2_id)} 
                  {match.winning_team === 'A' && ' 🏆'}
                </div>
                <div style={{ color: match.winning_team === 'B' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  <strong>Team B:</strong> {getPlayerName(match.team_b_player1_id)} & {getPlayerName(match.team_b_player2_id)}
                  {match.winning_team === 'B' && ' 🏆'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMatch && (
        <MatchDetailsModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
        />
      )}
    </div>
  );
}
