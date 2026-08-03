import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useElo } from '../context/EloContext';
import { X, Flame } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function PlayerProfileModal({ player, onClose }) {
  const { matches, players, activeGame } = useElo();

  const stats = useMemo(() => {
    if (!player) return null;

    const filteredMatches = matches.filter(m => (m.game_type || 'dominoes') === activeGame);
    const startRating = player.ratings?.[activeGame] || player.elo || 1200;

    let wins = 0;
    let losses = 0;
    let peakElo = startRating;
    let currentStreak = 0;
    let streakBroken = false;
    const partners = {};

    // Reconstruct Elo history (working backwards)
    let currentTempElo = startRating;
    const history = [{ match: 'Now', elo: startRating }];

    // matches are ordered newest first
    filteredMatches.forEach((match, index) => {
      const isTeamA = match.team_a_player1_id === player.id || match.team_a_player2_id === player.id;
      const isTeamB = match.team_b_player1_id === player.id || match.team_b_player2_id === player.id;
      
      if (!isTeamA && !isTeamB) return;

      const playerWon = (isTeamA && match.winning_team === 'A') || (isTeamB && match.winning_team === 'B');

      if (playerWon) {
        wins++;
        
        // Track partner for Best Duo
        const partnerId = isTeamA 
          ? (match.team_a_player1_id === player.id ? match.team_a_player2_id : match.team_a_player1_id)
          : (match.team_b_player1_id === player.id ? match.team_b_player2_id : match.team_b_player1_id);
        
        partners[partnerId] = (partners[partnerId] || 0) + 1;
      } else {
        losses++;
      }

      // Streak logic
      if (!streakBroken) {
        if (playerWon) currentStreak++;
        else streakBroken = true;
      }

      // Undo this match's delta to find previous Elo
      if (match.player_deltas && match.player_deltas[player.id] !== undefined) {
        currentTempElo -= match.player_deltas[player.id];
        if (currentTempElo > peakElo) peakElo = currentTempElo;
        history.unshift({ match: `Game ${filteredMatches.length - index}`, elo: currentTempElo });
      }
    });

    let bestPartnerId = null;
    let maxWins = 0;
    for (const [id, count] of Object.entries(partners)) {
      if (count > maxWins) { maxWins = count; bestPartnerId = id; }
    }

    const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

    return { wins, losses, winRate, peakElo, currentStreak, history, bestPartnerId, maxWins };
  }, [player, matches]);

  if (!player || !stats) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>{player.name}</h2>
          <button className="modal-close" onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="modal-body">
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Current Rating</span>
              <span className="stat-value">{player.ratings?.[activeGame] || player.elo || 1200}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Peak Rating</span>
              <span className="stat-value">{stats.peakElo}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Win Rate</span>
              <span className="stat-value">{stats.winRate}%</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{stats.wins}W - {stats.losses}L</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Win Streak</span>
              <span className="stat-value" style={{ color: stats.currentStreak >= 3 ? '#fb923c' : 'var(--accent-color)' }}>
                {stats.currentStreak} {stats.currentStreak >= 3 && <Flame size={16} style={{display:'inline'}}/>}
              </span>
            </div>
          </div>

          {stats.bestPartnerId && (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best Duo</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {players.find(p => p.id === stats.bestPartnerId)?.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>{stats.maxWins} wins together</div>
            </div>
          )}

          {stats.history.length > 1 && (
            <div style={{ marginTop: '2rem', height: '200px' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Elo History</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="match" hide />
                  <YAxis domain={['dataMin - 15', 'dataMax + 15']} stroke="rgba(255,255,255,0.3)" fontSize={12} width={35} />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Line type="monotone" dataKey="elo" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 3, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
