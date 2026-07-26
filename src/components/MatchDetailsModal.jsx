import React from 'react';
import { createPortal } from 'react-dom';
import { X, Info } from 'lucide-react';
import { useElo } from '../context/EloContext';

export default function MatchDetailsModal({ match, onClose }) {
  const { players } = useElo();
  if (!match) return null;

  const getPlayerName = (id) => {
    const player = players.find(p => p.id === id);
    return player ? player.name : 'Unknown Player';
  };

  const renderPlayerDelta = (playerId) => {
    if (!match.player_deltas) return <span style={{ color: 'var(--text-secondary)' }}>N/A</span>;
    const delta = match.player_deltas[playerId];
    if (delta === undefined) return <span style={{ color: 'var(--text-secondary)' }}>N/A</span>;
    
    const isPositive = delta > 0;
    return (
      <span style={{ 
        color: isPositive ? 'var(--accent-color)' : 'var(--danger-color)',
        fontWeight: 'bold' 
      }}>
        {isPositive ? '+' : ''}{delta}
      </span>
    );
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={24} /> Match Details
          </h2>
          <button className="modal-close" onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="modal-body">
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {new Date(match.created_at).toLocaleString()}
          </p>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: match.winning_team === 'A' ? 'var(--primary-color)' : 'var(--text-primary)' }}>
              Team A {match.winning_team === 'A' && '🏆'}
            </h3>
            <div className="flex-row space-between" style={{ marginBottom: '0.5rem' }}>
              <span>{getPlayerName(match.team_a_player1_id)}</span>
              {renderPlayerDelta(match.team_a_player1_id)}
            </div>
            <div className="flex-row space-between">
              <span>{getPlayerName(match.team_a_player2_id)}</span>
              {renderPlayerDelta(match.team_a_player2_id)}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: match.winning_team === 'B' ? 'var(--primary-color)' : 'var(--text-primary)' }}>
              Team B {match.winning_team === 'B' && '🏆'}
            </h3>
            <div className="flex-row space-between" style={{ marginBottom: '0.5rem' }}>
              <span>{getPlayerName(match.team_b_player1_id)}</span>
              {renderPlayerDelta(match.team_b_player1_id)}
            </div>
            <div className="flex-row space-between">
              <span>{getPlayerName(match.team_b_player2_id)}</span>
              {renderPlayerDelta(match.team_b_player2_id)}
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              <strong>Why are the points different?</strong><br/>
              The Elo math engine calculates expected scores <em>individually</em>. If an underdog (low rating) teams up with a pro (high rating) and they lose, the underdog loses fewer points than the pro, because the pro was mathematically expected to carry the team!
            </p>
          </div>

          {!match.player_deltas && (
            <p style={{ textAlign: 'center', color: 'var(--danger-color)', fontSize: '0.9rem', marginTop: '1rem' }}>
              Detailed point breakdowns are not available for legacy matches.
            </p>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}
