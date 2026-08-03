import React, { useState } from 'react';
import { useElo } from '../context/EloContext';

export default function MatchForm({ onSuccess }) {
  const { players, recordMatch, activeGame } = useElo();
  const [teamA, setTeamA] = useState(['', '']);
  const [teamB, setTeamB] = useState(['', '']);
  const [winner, setWinner] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const is1v1 = activeGame === 'pingpong';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    const selectedPlayers = is1v1 ? [teamA[0], teamB[0]] : [teamA[0], teamA[1], teamB[0], teamB[1]];
    
    if (selectedPlayers.some(p => !p)) {
        setError("Please select all required players.");
        return;
    }

    // Validate uniqueness
    if (new Set(selectedPlayers).size !== selectedPlayers.length) {
      setError("Please select unique players.");
      return;
    }

    if (!winner) {
      setError("Please select a winning team.");
      return;
    }

    recordMatch(is1v1 ? [teamA[0]] : teamA, is1v1 ? [teamB[0]] : teamB, winner);
    setSuccessMsg(`Match recorded! Team ${winner} won.`);
    setWinner('');
    setTeamA(['', '']);
    setTeamB(['', '']);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (players.length < (is1v1 ? 2 : 4)) {
    return (
      <div className="glass-panel animate-fade-in text-center">
        <h2>Record Match</h2>
        <p>You need at least {is1v1 ? 2 : 4} players to record a match. Currently have {players.length}.</p>
      </div>
    );
  }

  const getRating = (player) => player.ratings?.[activeGame] || player.elo || 1200;

  const PlayerSelect = ({ value, onChange, label }) => (
    <div className="flex-col" style={{ gap: '0.25rem', flex: 1 }}>
      <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} required={!label.includes("2") || !is1v1}>
        <option value="" disabled>Select Player</option>
        {players.map(p => <option key={p.id} value={p.id}>{p.name} ({getRating(p)})</option>)}
      </select>
    </div>
  );

  return (
    <div className="glass-panel animate-fade-in">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Record Match</h2>
      
      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      {successMsg && <div style={{ color: 'var(--accent-color)', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{successMsg}</div>}

      <form onSubmit={handleSubmit} className="flex-col" style={{ gap: '2rem' }}>
        
        {/* Team A */}
        <div style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <h3 style={{ color: '#60a5fa', marginBottom: '1rem', marginTop: 0 }}>Team A</h3>
          <div className="flex-row">
            <PlayerSelect value={teamA[0]} onChange={(val) => setTeamA([val, teamA[1]])} label="Player 1" />
            {!is1v1 && <PlayerSelect value={teamA[1]} onChange={(val) => setTeamA([teamA[0], val])} label="Player 2" />}
          </div>
        </div>

        <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--text-secondary)' }}>VS</div>

        {/* Team B */}
        <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <h3 style={{ color: '#34d399', marginBottom: '1rem', marginTop: 0 }}>Team B</h3>
          <div className="flex-row">
            <PlayerSelect value={teamB[0]} onChange={(val) => setTeamB([val, teamB[1]])} label="Player 1" />
            {!is1v1 && <PlayerSelect value={teamB[1]} onChange={(val) => setTeamB([teamB[0], val])} label="Player 2" />}
          </div>
        </div>

        {/* Winner Selection */}
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', marginTop: 0 }}>Who Won?</h3>
          <div className="flex-row" style={{ gap: '1rem' }}>
            <button 
              type="button"
              className="btn" 
              style={{ flex: 1, background: winner === 'A' ? '#2563eb' : 'rgba(59, 130, 246, 0.2)' }}
              onClick={() => setWinner('A')}
            >
              Team A Won
            </button>
            <button 
              type="button"
              className="btn" 
              style={{ flex: 1, background: winner === 'B' ? '#059669' : 'rgba(16, 185, 129, 0.2)' }}
              onClick={() => setWinner('B')}
            >
              Team B Won
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-accent" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
          Record Match Result
        </button>
      </form>
    </div>
  );
}
