import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
const EloContext = createContext();

export const useElo = () => useContext(EloContext);

export const EloProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

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
    // Calculate starting elo (average of all players, or 1200)
    const startingElo = players.length > 0 
      ? Math.round(players.reduce((sum, p) => sum + p.elo, 0) / players.length)
      : 1200;

    const newPlayer = {
      id: crypto.randomUUID(),
      name,
      elo: startingElo,
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
    // Get player objects
    const teamA = teamAIds.map(id => players.find(p => p.id === id));
    const teamB = teamBIds.map(id => players.find(p => p.id === id));

    // Calculate Team Ratings (Averages)
    const teamARating = (teamA[0].elo + teamA[1].elo) / 2;
    const teamBRating = (teamB[0].elo + teamB[1].elo) / 2;

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
    deltas[teamA[0].id] = getIndividualDelta(teamA[0].elo, teamBRating, teamAWon);
    deltas[teamA[1].id] = getIndividualDelta(teamA[1].elo, teamBRating, teamAWon);

    // Team B players
    const teamBWon = winningTeam === 'B';
    deltas[teamB[0].id] = getIndividualDelta(teamB[0].elo, teamARating, teamBWon);
    deltas[teamB[1].id] = getIndividualDelta(teamB[1].elo, teamARating, teamBWon);
    
    // Create new players array with updated ratings
    const updatedPlayers = players.map(player => {
      if (deltas[player.id] !== undefined) {
        return { ...player, elo: player.elo + deltas[player.id] };
      }
      return player;
    });

    // Store the average absolute change for the match history UI
    const teamAChangeTotal = Math.abs(deltas[teamA[0].id]) + Math.abs(deltas[teamA[1].id]);
    const averageChange = Math.round(teamAChangeTotal / 2);

    const newMatch = {
      id: crypto.randomUUID(),
      team_a_player1_id: teamAIds[0],
      team_a_player2_id: teamAIds[1],
      team_b_player1_id: teamBIds[0],
      team_b_player2_id: teamBIds[1],
      winning_team: winningTeam,
      elo_change: averageChange, // Now represents the average points exchanged per player
      created_at: new Date().toISOString()
    };

    if (supabase) {
      // Run updates in DB
      await supabase.from('matches').insert([newMatch]);
      // Update each player individually in DB
      for (const player of updatedPlayers) {
        if (teamAIds.includes(player.id) || teamBIds.includes(player.id)) {
           await supabase.from('players').update({ elo: player.elo }).eq('id', player.id);
        }
      }
    }

    // Update Local State
    setPlayers(updatedPlayers);
    setMatches(prev => [newMatch, ...prev]);
  };

  return (
    <EloContext.Provider value={{ players, matches, loading, addPlayer, recordMatch }}>
      {children}
    </EloContext.Provider>
  );
};
