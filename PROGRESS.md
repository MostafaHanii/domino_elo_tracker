## Overview
A PWA (Progressive Web App) to track the Elo rating of players in a 2v2 Dominoes game. Stack: Vite + React + Supabase + Vanilla CSS.

## Current State
Initial V1 completed. The app features a premium dark-mode glassmorphic UI, player management, 2v2 match recording, leaderboard, and match history. Data is handled via a context system that seamlessly defaults to `LocalStorage` until Supabase credentials are provided.

## Decisions & Trade-offs
- Used standard Elo calculation adapted for 2v2 (average team rating).
- New players automatically start at the exact average Elo of the group.
- Built as a PWA (Progressive Web App) rather than a native mobile app to avoid App Store delays and fees, while still allowing "Add to Home Screen" native behavior on iOS/Android.
- Supabase is configured for real-time cloud sync, but currently runs entirely locally (fallback) to allow immediate usage without waiting for DB credentials.

## Next Steps
- Run `supabase_schema.sql` in your Supabase project.
- Create a `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable cloud syncing.
- Add `pwa-192x192.png` and `pwa-512x512.png` icons to the `public` folder to fully enable PWA installation.

## Known Issues
- PWA icon assets are missing.
