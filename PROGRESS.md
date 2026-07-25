# Dominoes Elo Tracker

## Overview
A dynamic, mobile-first Web App (PWA) designed to track Elo ratings for 2v2 Dominoes matches among a group of friends. Built with React (Vite) and styled with custom Vanilla CSS (glassmorphism design). The app features a persistent cloud backend powered by Supabase, enabling cross-device synchronization without needing a dedicated server.

## Current State
- **Functional:** Core features are completely implemented and deployed via Vercel.
- **Features Include:**
  - Player creation (new players start at the group's current average Elo).
  - 2v2 Match recording.
  - "Rapid Rematch" flow to log multiple sequential games without re-selecting players.
  - Edit player names on the fly.
  - "Undo Last Match" capability to instantly fix mistaken inputs.
  - Live leaderboard and historical match logs.
  - LocalStorage fallback mode if Supabase variables are missing.

## Decisions & Trade-offs
- **Individual Elo Math (Not Team-Wide):** Instead of calculating one delta for the team and applying it equally, the math engine calculates the expected score for *each individual player* against the enemy team's average. This protects lower-rated players ("underdogs") from massive penalties when playing alongside highly-rated friends against average opponents.
- **Undo Strategy:** To support "Undo Last Match", we opted to save the exact point exchange (`player_deltas` as JSON) directly inside the match record in the database. This allows for a perfect mathematical reversal without needing to completely rebuild the entire Elo history from scratch.
- **PWA vs Native:** Chose to start with a PWA (Progressive Web App) to get it onto both iOS and Android instantly via URL (Vercel), rather than dealing with App Store reviews initially.

## Next Steps
- Implement detailed player statistics (Win/Loss ratios, highest Elo reached).
- Begin the migration plan to a full-fledged native app (e.g., using React Native / Expo) if the user base grows or native push notifications are desired.

## Known Issues
- Currently, the app relies heavily on the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` being securely configured in Vercel. If these fail, the app quietly drops back to LocalStorage, which won't sync with other users.
