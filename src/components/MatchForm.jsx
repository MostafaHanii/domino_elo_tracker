import React, { useState } from 'react';
import { useElo } from '../context/EloContext';

export default function MatchForm({ onSuccess }) {
  const { players, recordMatch } = useElo();
  const [teamA1, setTeamA1] = useState('');
  const [teamA2, setTeamA2] = useState('');
  const [teamB1, setTeamB1] = useState('');
  const [teamB2, setTeamB2] = useState('');
  const [winner, setWinner] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    const selectedPlayers = [teamA1, teamA2, teamB1, teamB2];
    
    // Validate uniqueness
    if (new Set(selectedPlayers).size !== 4) {
      setError("Please select 4 unique players.");
      return;
    }

    if (!winner) {
      setError("Please select a winning team.");
      return;
    }

    recordMatch([teamA1, teamA2], [teamB1, teamB2], winner);
    setSuccessMsg(`Match recorded! Team ${winner} won.`);
    setWinner('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (players.length < 4) {
    return (
      <div className="glass-panel animate-fade-in text-center">
        <h2>Record Match</h2>
        <p>You need at least 4 players to record a match. Currently have {players.length}.</p>
      </div>
    );
  }

  const PlayerSelect = ({ value, onChange, label }) => (
    <div className="flex-col" style={{ gap: '0.25rem', flex: 1 }}>
      <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} required>
        <option value="" disabled>Select Player</option>
        {players.map(p => <option key={p.id} value={p.id}>{p.name} ({p.elo})</option>)}
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
            <PlayerSelect value={teamA1} onChange={setTeamA1} label="Player 1" />
            <PlayerSelect value={teamA2} onChange={setTeamA2} label="Player 2" />
          </div>
        </div>

        <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--text-secondary)' }}>VS</div>

        {/* Team B */}
        <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <h3 style={{ color: '#34d399', marginBottom: '1rem', marginTop: 0 }}>Team B</h3>
          <div className="flex-row">
            <PlayerSelect value={teamB1} onChange={setTeamB1} label="Player 1" />
            <PlayerSelect value={teamB2} onChange={setTeamB2} label="Player 2" />
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
