
export interface TeamScores {
  A: { gross: number; net: number };
  B: { gross: number; net: number };
}

export interface Player {
  name: string;
  team: 'A' | 'B';
}

export interface Payment {
  from: string;
  to: string;
  amount: number;
  reason: string;
}

export interface ConsolidatedPayee {
  to: string;
  amount: number;
  reason: string;
}

export interface ConsolidatedPayment {
  from: string;
  payees: ConsolidatedPayee[];
}
