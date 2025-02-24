
export interface MatchResult {
  type: ('nassau' | 'match' | 'skins' | 'birdies' | 'eagles')[];
  amounts: {
    nassau?: number;
    skins?: number;
    birdies?: number;
    eagles?: number;
  };
  winners: string[];
  losers: string[];
  description: string;
  bets: string[];
}

export interface PaymentDetail {
  from: string;
  to: string;
  amount: number;
  reason: string;
}

export interface Player {
  name: string;
  team: string;  // Changed from 'A' | 'B' to string to support multiple teams
}

export interface TeamScores {
  front9: number;
  back9: number;
  total: number;
}
