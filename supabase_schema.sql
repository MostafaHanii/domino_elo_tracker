-- Run this in your Supabase SQL Editor

-- 1. Create Players Table
CREATE TABLE public.players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    elo INTEGER NOT NULL DEFAULT 1200,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Matches Table
CREATE TABLE public.matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_a_player1_id UUID REFERENCES public.players(id),
    team_a_player2_id UUID REFERENCES public.players(id),
    team_b_player1_id UUID REFERENCES players(id) NOT NULL,
    team_b_player2_id UUID REFERENCES players(id) NOT NULL,
    winning_team VARCHAR(1) NOT NULL CHECK (winning_team IN ('A', 'B')),
    elo_change INTEGER NOT NULL,
    player_deltas JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS (Row Level Security) - Allowing anonymous access for this simple app
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access on players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access on players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access on players" ON public.players FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous read access on matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access on matches" ON public.matches FOR INSERT WITH CHECK (true);
