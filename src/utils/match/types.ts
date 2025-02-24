
export interface MatchResult {
  type: ('nassau' | 'match' | 'skins' | 'birdies' | 'eagles' | 'best-ball' | 'press')[];
  scoringFormat: {
    type: 'stroke' | 'match';
    teamScoring: 'aggregate' | 'best-ball' | 'two-best-balls';
    handicapPercentage: 100 | 90 | 85 | 75 | 50 | 0;
  };
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
  details?: {
    nassau?: any;
    skins?: {
      skins: Array<{ hole: number; winner: string; amount: number }>;
      payments: PaymentDetail[];
    };
    birdies?: {
      birdies: Array<{ hole: number; player: string; amount: number }>;
      payments: PaymentDetail[];
    };
    eagles?: {
      eagles: Array<{ hole: number; player: string; amount: number }>;
      payments: PaymentDetail[];
    };
    consolidatedPayments?: Array<{
      from: string;
      payees: Array<{
        to: string;
        amount: number;
        reason: string;
      }>;
    }>;
  };
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
