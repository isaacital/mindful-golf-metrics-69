
interface MatchResult {
  type: 'nassau' | 'match' | 'skins';
  amount: number;
  winners: string[];
  losers: string[];
  totalPayout: number;
  description: string;
}

export const parseMatchInput = (input: string): MatchResult | null => {
  input = input.toLowerCase();
  
  // Nassau match parsing
  if (input.includes('nassau')) {
    const amount = parseAmount(input);
    return {
      type: 'nassau',
      amount: amount,
      winners: [], // These would be calculated based on front 9, back 9, and total
      losers: [],
      totalPayout: amount * 3, // Front 9, back 9, and total
      description: `Nassau match with $${amount} per side`
    };
  }

  // Regular match parsing
  if (input.includes('match')) {
    const amount = parseAmount(input);
    return {
      type: 'match',
      amount: amount,
      winners: [],
      losers: [],
      totalPayout: amount,
      description: `Regular match with $${amount} at stake`
    };
  }

  // Skins game parsing
  if (input.includes('skins')) {
    const amount = parseAmount(input);
    return {
      type: 'skins',
      amount: amount,
      winners: [],
      losers: [],
      totalPayout: amount * 18, // Maximum possible payout
      description: `Skins game with $${amount} per hole`
    };
  }

  return null;
};

const parseAmount = (input: string): number => {
  const matches = input.match(/\$?\s*(\d+)/);
  return matches ? parseInt(matches[1]) : 0;
};

export const calculateNassauResults = (
  teamAScores: { front9: number; back9: number; total: number },
  teamBScores: { front9: number; back9: number; total: number },
  amount: number
) => {
  const results = {
    front9: { winner: '', amount: 0 },
    back9: { winner: '', amount: 0 },
    total: { winner: '', amount: 0 },
    totalPayout: 0
  };

  // Front 9
  if (teamAScores.front9 < teamBScores.front9) {
    results.front9 = { winner: 'Team A', amount };
  } else if (teamBScores.front9 < teamAScores.front9) {
    results.front9 = { winner: 'Team B', amount };
  }

  // Back 9
  if (teamAScores.back9 < teamBScores.back9) {
    results.back9 = { winner: 'Team A', amount };
  } else if (teamBScores.back9 < teamAScores.back9) {
    results.back9 = { winner: 'Team B', amount };
  }

  // Total
  if (teamAScores.total < teamBScores.total) {
    results.total = { winner: 'Team A', amount };
  } else if (teamBScores.total < teamAScores.total) {
    results.total = { winner: 'Team B', amount };
  }

  results.totalPayout = 
    (results.front9.amount || 0) + 
    (results.back9.amount || 0) + 
    (results.total.amount || 0);

  return results;
};
