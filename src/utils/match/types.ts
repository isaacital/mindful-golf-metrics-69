
export interface MatchResult {
  type: ('nassau' | 'match' | 'skins' | 'birdies' | 'eagles' | 'best-ball' | 'press')[];
  amounts: {
    nassau?: number;
    skins?: number;
    birdies?: number;
    eagles?: number;
    bestBall?: number;
    press?: number;
  };
  settings?: {
    automaticPress?: boolean;
    pressStartHole?: number;
    pressAmount?: number;
    teamFormat?: 'individual' | 'bestBall' | 'alternate' | 'scramble';
    handicaps?: 'full' | 'threequarter' | 'half' | 'none';
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
  team: 'A' | 'B';
}

export interface TeamScores {
  front9: number;
  back9: number;
  total: number;
}
