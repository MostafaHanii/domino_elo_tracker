import React, { useState, useMemo } from 'react';
import { useElo } from '../context/EloContext';
import { Swords } from 'lucide-react';

export default function HeadToHead() {
  const { players, matches } = useElo();
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');

  const stats = useMemo(() => {
    if (!player1Id || !player2Id || player1Id === player2Id) return null;

    let p1Wins = 0;
    let p2Wins = 0;
    let totalMatches = 0;

    matches.forEach(match => {
      // Check if they are on OPPOSING teams
      const p1InA = match.team_a_player1_id === player1Id || match.team_a_player2_id === player1Id;
      const p1InB = match.team_b_player1_id === player1Id || match.team_b_player2_id === player1Id;
      
      const p2InA = match.team_a_player1_id === player2Id || match.team_a_player2_id === player2Id;
      const p2InB = match.team_b_player1_id === player2Id || match.team_b_player2_id === player2Id;

      if ((p1InA && p2InB) || (p1InB && p2InA)) {
        totalMatches++;
        if (p1InA && match.winning_team === 'A') p1Wins++;
        else if (p1InB && match.winning_team === 'B') p1Wins++;
        else p2Wins++;
      }
    });

    const p1WinRate = totalMatches > 0 ? (p1Wins / totalMatches) * 100 : 0;
    const p2WinRate = totalMatches > 0 ? (p2Wins / totalMatches) * 100 : 0;

    return { p1Wins, p2Wins, totalMatches, p1WinRate, p2WinRate };
  }, [player1Id, player2Id, matches]);

  const p1 = players.find(p => p.id === player1Id);
  const p2 = players.find(p => p.id === player2Id);

  return (
    <div className="glass-panel animate-fade-in">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <Swords /> Head to Head
      </h2>

      <div className="flex-col" style={{ gap: '1rem', marginBottom: '2rem' }}>
        <select className="input" value={player1Id} onChange={e => setPlayer1Id(e.target.value)}>
          <option value="">Select Player 1</option>
          {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)', textAlign: 'center' }}>VS</span>
        <select className="input" value={player2Id} onChange={e => setPlayer2Id(e.target.value)}>
          <option value="">Select Player 2</option>
          {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {player1Id && player2Id && player1Id === player2Id && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Please select two different players.</p>
      )}

      {stats && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }} className="animate-fade-in">
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {stats.totalMatches} Matches Played
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span style={{ color: stats.p1Wins >= stats.p2Wins ? 'var(--accent-color)' : 'white' }}>{p1?.name}: {stats.p1Wins}</span>
            <span style={{ color: stats.p2Wins >= stats.p1Wins ? '#ef4444' : 'white' }}>{p2?.name}: {stats.p2Wins}</span>
          </div>

          <div style={{ width: '100%', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${stats.p1WinRate}%`, background: 'var(--accent-color)', height: '100%', transition: 'width 0.5s ease' }}></div>
            <div style={{ width: `${stats.p2WinRate}%`, background: '#ef4444', height: '100%', transition: 'width 0.5s ease' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
