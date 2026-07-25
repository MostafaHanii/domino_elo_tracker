function calculateElo(teamARating, teamBRating, teamAWon) {
  const K = 32;
  const expectedA = 1 / (1 + Math.pow(10, (teamBRating - teamARating) / 400));
  const actualA = teamAWon ? 1 : 0;
  return Math.round(K * (actualA - expectedA));
}

// Case 1: Equal teams
let delta = calculateElo(1200, 1200, true);
console.log("Equal teams (1200 vs 1200). A wins. Delta A:", delta);

// Case 2: Underdogs (Team A: 1000) lose to Favorites (Team B: 1400)
// A loses -> A won = false
delta = calculateElo(1000, 1400, false);
console.log("Underdogs (1000) vs Favorites (1400). Underdogs (A) lose. Delta A:", delta);

// Case 3: Underdogs (Team B: 1000) lose to Favorites (Team A: 1400)
// A wins -> A won = true
delta = calculateElo(1400, 1000, true);
console.log("Favorites (1400) vs Underdogs (1000). Favorites (A) win. Delta A:", delta, " (Team B gets opposite, so B gets", -delta, ")");

// Case 4: Favorites (Team A: 1400) lose to Underdogs (Team B: 1000)
// A loses -> A won = false
delta = calculateElo(1400, 1000, false);
console.log("Favorites (1400) vs Underdogs (1000). Favorites (A) lose. Delta A:", delta, " (Team B gets opposite, so B gets", -delta, ")");
