import React, { useState } from 'react';
import { useElo } from './context/EloContext';
import { Users, History, Trophy, Swords, Activity } from 'lucide-react';
import PlayerList from './components/PlayerList';
import MatchForm from './components/MatchForm';
import Leaderboard from './components/Leaderboard';
import MatchHistory from './components/MatchHistory';
import HeadToHead from './components/HeadToHead';

function App() {
  const { loading } = useElo();
  const [activeTab, setActiveTab] = useState('leaderboard');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2 className="animate-fade-in">Loading data...</h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1>Dominoes Elo Tracker</h1>

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
