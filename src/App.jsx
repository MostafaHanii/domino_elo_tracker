import React, { useState } from 'react';
import { useElo } from './context/EloContext';
import { Users, History, Trophy, Swords, Activity, Dices } from 'lucide-react';
// We'll use a generic icon for ping pong if TableTennis isn't available, or custom SVG if needed. 
// Lucide has 'Table' or we can just use text/emoji for ping pong if needed. Let's try standard lucide icons first, or emojis.
import PlayerList from './components/PlayerList';
import MatchForm from './components/MatchForm';
import Leaderboard from './components/Leaderboard';
import MatchHistory from './components/MatchHistory';
import HeadToHead from './components/HeadToHead';

function App() {
  const { loading, activeGame, setActiveGame } = useElo();
  const [activeTab, setActiveTab] = useState('leaderboard');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2 className="animate-fade-in">Loading data...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>Elo Tracker</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', background: 'rgba(30, 41, 59, 0.5)', padding: '0.5rem', borderRadius: '16px', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
        <button 
          onClick={() => setActiveGame('dominoes')}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', background: activeGame === 'dominoes' ? 'var(--primary-color)' : 'transparent', color: activeGame === 'dominoes' ? 'white' : 'var(--text-secondary)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Dices size={20} />
          <span style={{ fontSize: '0.7rem' }}>Dominoes</span>
        </button>
        <button 
          onClick={() => setActiveGame('pingpong')}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', background: activeGame === 'pingpong' ? 'var(--accent-color)' : 'transparent', color: activeGame === 'pingpong' ? 'white' : 'var(--text-secondary)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: '20px' }}>🏓</span>
          <span style={{ fontSize: '0.7rem' }}>Ping Pong</span>
        </button>
        <button 
          onClick={() => setActiveGame('pingpong_doubles')}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', background: activeGame === 'pingpong_doubles' ? '#fb923c' : 'transparent', color: activeGame === 'pingpong_doubles' ? 'white' : 'var(--text-secondary)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <div style={{ display: 'flex' }}>
            <span style={{ fontSize: '1.2rem', lineHeight: '20px' }}>🏓</span>
            <span style={{ fontSize: '1.2rem', lineHeight: '20px', marginLeft: '-8px' }}>🏓</span>
          </div>
          <span style={{ fontSize: '0.7rem' }}>Doubles</span>
        </button>
      </div>

      <div className="tabs glass-panel">
        <div 
          className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          <Trophy size={18} style={{ marginBottom: '-4px', marginRight: '6px' }} />
          Leaderboard
        </div>
        <div 
          className={`tab ${activeTab === 'match' ? 'active' : ''}`}
          onClick={() => setActiveTab('match')}
        >
          <Activity size={18} style={{ marginBottom: '-4px', marginRight: '6px' }} />
          Record Match
        </div>
        <div 
          className={`tab ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          <Users size={18} style={{ marginBottom: '-4px', marginRight: '6px' }} />
          Players
        </div>
        <div 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={18} style={{ marginBottom: '-4px', marginRight: '6px' }} />
          History
        </div>
        <div 
          className={`tab ${activeTab === 'rivals' ? 'active' : ''}`}
          onClick={() => setActiveTab('rivals')}
        >
          <Swords size={18} style={{ marginBottom: '-4px', marginRight: '6px' }} />
          Rivals
        </div>
      </div>

      <div className="content">
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'match' && <MatchForm onSuccess={() => setActiveTab('leaderboard')} />}
        {activeTab === 'players' && <PlayerList />}
        {activeTab === 'history' && <MatchHistory />}
        {activeTab === 'rivals' && <HeadToHead />}
      </div>
    </div>
  );
}

export default App;
