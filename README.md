# 🎲 Dominoes Elo Tracker

A beautiful, mobile-first Progressive Web App (PWA) designed to track Elo ratings for 2v2 Dominoes matches among a group of friends. 

Built with React (Vite) and styled with a custom glassmorphism design system, this app features a persistent cloud backend powered by Supabase, enabling seamless cross-device synchronization.

## ✨ Features

- **Individual Elo Math:** Advanced rating algorithm that calculates expected scores for *each individual player* against the enemy team's average. This protects lower-rated players ("underdogs") from massive penalties when playing alongside highly-rated friends against average opponents.
- **Dynamic Leaderboard:** Real-time rankings of all registered players.
- **Rapid Rematch Flow:** Easily log multiple sequential games between the same teams without having to re-select players every time.
- **Undo Match:** Instantly undo the most recent match and perfectly reverse the exact Elo points that were exchanged.
- **Offline Fallback:** If Supabase is unreachable or not configured, the app quietly falls back to LocalStorage so you can still track games locally.
- **PWA Ready:** Installable directly to your iOS or Android home screen for a native app feel.

## 🛠 Tech Stack

- **Frontend:** React, Vite, React Context API
- **Backend/DB:** Supabase (PostgreSQL)
- **Styling:** Custom Vanilla CSS with CSS Variables and Glassmorphism
- **Icons:** Lucide React

## 🚀 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/domino_elo_tracker.git
   cd domino_elo_tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase keys:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## 🗄️ Database Setup (Supabase)

To set up the cloud database, navigate to your Supabase project's SQL Editor and run the contents of the `supabase_schema.sql` file provided in this repository. This will automatically create the required `players` and `matches` tables along with the appropriate Row Level Security (RLS) policies.

## ☁️ Deployment

This project is optimized for zero-config deployment on **Vercel** or **Netlify**.
Simply import your GitHub repository into Vercel, add the two `VITE_SUPABASE_*` environment variables in the project settings, and deploy!
