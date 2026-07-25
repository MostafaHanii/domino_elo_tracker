-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Players Table (Safe to run multiple times)
CREATE TABLE IF NOT EXISTS public.players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    elo INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Matches Table (Safe to run multiple times)
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_a_player1_id UUID REFERENCES public.players(id),
    team_a_player2_id UUID REFERENCES public.players(id),
    team_b_player1_id UUID REFERENCES public.players(id),
    team_b_player2_id UUID REFERENCES public.players(id),
    winning_team VARCHAR(1) NOT NULL CHECK (winning_team IN ('A', 'B')),
    elo_change INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Safely update matches table with the new player_deltas column
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS player_deltas JSONB;

-- 4. Enable RLS (Row Level Security) - Allowing anonymous access for this simple app
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Drop existing first to prevent errors when updating)
DROP POLICY IF EXISTS "Allow anonymous read for players" ON public.players;
CREATE POLICY "Allow anonymous read for players" ON public.players FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert for players" ON public.players;
CREATE POLICY "Allow anonymous insert for players" ON public.players FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous update for players" ON public.players;
CREATE POLICY "Allow anonymous update for players" ON public.players FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anonymous read for matches" ON public.matches;
CREATE POLICY "Allow anonymous read for matches" ON public.matches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert for matches" ON public.matches;
CREATE POLICY "Allow anonymous insert for matches" ON public.matches FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous delete for matches" ON public.matches;
CREATE POLICY "Allow anonymous delete for matches" ON public.matches FOR DELETE USING (true);
