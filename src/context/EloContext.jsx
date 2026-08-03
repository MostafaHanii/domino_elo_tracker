import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
const EloContext = createContext();

export const useElo = () => useContext(EloContext);

export const EloProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState('dominoes'); // 'dominoes', 'pingpong', 'pingpong_doubles'

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (supabase) {
        // Load from Supabase
        const { data: playersData } = await supabase.from('players').select('*').order('elo', { ascending: false });
        const { data: matchesData } = await supabase.from('matches').select('*').order('created_at', { ascending: false });
        
        if (playersData) setPlayers(playersData);
        if (matchesData) setMatches(matchesData);
      } else {
        // Fallback to LocalStorage
        const savedPlayers = JSON.parse(localStorage.getItem('domino_players')) || [];
        const savedMatches = JSON.parse(localStorage.getItem('domino_matches')) || [];
        setPlayers(savedPlayers);
        setMatches(savedMatches);
      }
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Save to LocalStorage whenever state changes (if not using Supabase)
  useEffect(() => {
    if (!supabase && !loading) {
      localStorage.setItem('domino_players', JSON.stringify(players));
      localStorage.setItem('domino_matches', JSON.stringify(matches));
    }
  }, [players, matches, loading]);

  const addPlayer = async (name) => {
    // Calculate starting elo for active game
    const startingElo = players.length > 0 
      ? Math.round(players.reduce((sum, p) => sum + (p.ratings?.[activeGame] || 1200), 0) / players.length)
      : 1200;

    const newPlayer = {
      id: crypto.randomUUID(),
      name,
      elo: startingElo, // keep legacy sync
      ratings: { dominoes: 1200, pingpong: 1200, pingpong_doubles: 1200, [activeGame]: startingElo },
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('players').insert([newPlayer]).select();
      if (!error && data) {
        setPlayers(prev => [...prev, data[0]]);
      }
    } else {
      setPlayers(prev => [...prev, newPlayer]);
    }
  };

  const recordMatch = async (teamAIds, teamBIds, winningTeam) => {
    const is1v1 = activeGame === 'pingpong';

    // Get player objects
    const teamA = teamAIds.map(id => players.find(p => p.id === id)).filter(Boolean);
    const teamB = teamBIds.map(id => players.find(p => p.id === id)).filter(Boolean);

    // Get ratings
    const getRating = (player) => player.ratings?.[activeGame] || player.elo || 1200;

    // Calculate Team Ratings (Averages for 2v2, direct for 1v1)
    const teamARating = is1v1 ? getRating(teamA[0]) : (getRating(teamA[0]) + getRating(teamA[1])) / 2;
    const teamBRating = is1v1 ? getRating(teamB[0]) : (getRating(teamB[0]) + getRating(teamB[1])) / 2;

    const K = 32;

    // Helper to calculate individual delta
    const getIndividualDelta = (playerElo, enemyTeamElo, won) => {
      const expected = 1 / (1 + Math.pow(10, (enemyTeamElo - playerElo) / 400));
      const actual = won ? 1 : 0;
      return Math.round(K * (actual - expected));
    };

    // Calculate deltas for each player individually
    const deltas = {};
    
    // Team A players
    const teamAWon = winningTeam === 'A';
    deltas[teamA[0].id] = getIndividualDelta(getRating(teamA[0]), teamBRating, teamAWon);
    if (!is1v1) deltas[teamA[1].id] = getIndividualDelta(getRating(teamA[1]), teamBRating, teamAWon);

    // Team B players
    const teamBWon = winningTeam === 'B';
    deltas[teamB[0].id] = getIndividualDelta(getRating(teamB[0]), teamARating, teamBWon);
    if (!is1v1) deltas[teamB[1].id] = getIndividualDelta(getRating(teamB[1]), teamARating, teamBWon);
    
    // Create new players array with updated ratings
    const updatedPlayers = players.map(player => {
      if (deltas[player.id] !== undefined) {
        const newRating = getRating(player) + deltas[player.id];
        return { 
          ...player, 
          elo: activeGame === 'dominoes' ? newRating : player.elo, // legacy sync
          ratings: { ...(player.ratings || {}), [activeGame]: newRating }
        };
      }
      return player;
    });

    // Store the average absolute change for the match history UI
    let averageChange;
    if (is1v1) {
      averageChange = Math.abs(deltas[teamA[0].id]);
    } else {
      const teamAChangeTotal = Math.abs(deltas[teamA[0].id]) + Math.abs(deltas[teamA[1].id]);
      averageChange = Math.round(teamAChangeTotal / 2);
    }

    const newMatch = {
      id: crypto.randomUUID(),
      game_type: activeGame,
      team_a_player1_id: teamAIds[0],
      team_a_player2_id: is1v1 ? null : teamAIds[1],
      team_b_player1_id: teamBIds[0],
      team_b_player2_id: is1v1 ? null : teamBIds[1],
      winning_team: winningTeam,
      elo_change: averageChange,
      player_deltas: deltas,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      // Run updates in DB
      await supabase.from('matches').insert([newMatch]);
      // Update each player individually in DB
      for (const player of updatedPlayers) {
        if (deltas[player.id] !== undefined) {
           await supabase.from('players').update({ elo: player.elo, ratings: player.ratings }).eq('id', player.id);
        }
      }
    }

    // Update Local State
    setPlayers(updatedPlayers);
    setMatches(prev => [newMatch, ...prev]);
  };

  const editPlayer = async (id, newName) => {
    const updatedPlayers = players.map(p => p.id === id ? { ...p, name: newName } : p);
    
    if (supabase) {
      const { error } = await supabase.from('players').update({ name: newName }).eq('id', id);
      if (error) {
        console.error(error);
        alert("Failed to save to database. You might need to run the updated SQL schema.");
        return;
      }
    }
    
    setPlayers(updatedPlayers);
  };

  const undoLastMatch = async () => {
    if (matches.length === 0) return;
    const lastMatch = matches[0];
    
    if (!lastMatch.player_deltas) {
      alert("Cannot undo this match! It was recorded before the Undo feature was added, so its exact points weren't tracked.");
      return;
    }
    
    const updatedPlayers = players.map(player => {
      if (lastMatch.player_deltas && lastMatch.player_deltas[player.id] !== undefined) {
        const gameMode = lastMatch.game_type || 'dominoes';
        const newRating = (player.ratings?.[gameMode] || player.elo) - lastMatch.player_deltas[player.id];
        return { 
          ...player, 
          elo: gameMode === 'dominoes' ? newRating : player.elo,
          ratings: { ...(player.ratings || {}), [gameMode]: newRating }
        };
      }
      return player;
    });

    if (supabase) {
      const { error } = await supabase.from('matches').delete().eq('id', lastMatch.id);
      if (error) {
        console.error(error);
        alert("Failed to delete match from database. You might need to run the updated SQL schema.");
        return;
      }
      for (const player of updatedPlayers) {
        if (lastMatch.player_deltas && lastMatch.player_deltas[player.id] !== undefined) {
           await supabase.from('players').update({ elo: player.elo, ratings: player.ratings }).eq('id', player.id);
        }
      }
    }

    setPlayers(updatedPlayers);
    setMatches(prev => prev.slice(1));
  };

  return (
    <EloContext.Provider value={{ players, matches, loading, activeGame, setActiveGame, addPlayer, recordMatch, editPlayer, undoLastMatch }}>
      {children}
    </EloContext.Provider>
  );
};
