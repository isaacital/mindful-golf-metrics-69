
interface MatchResult {
  type: ('nassau' | 'match' | 'skins' | 'birdies' | 'eagles')[];
  amounts: {
    nassau?: number;
    skins?: number;
    birdies?: number;
    eagles?: number;
  };
  winners: string[];
  losers: string[];
  totalPayout: number;
  description: string;
}

export const parseMatchInput = (input: string): MatchResult | null => {
  input = input.toLowerCase();
  const result: MatchResult = {
    type: [],
    amounts: {},
    winners: [],
    losers: [],
    totalPayout: 0,
    description: ''
  };

  let descriptions: string[] = [];
  
  // Nassau match parsing
  if (input.includes('nassau')) {
    const amount = parseAmount(input, 'nassau');
    if (amount) {
      result.type.push('nassau');
      result.amounts.nassau = amount;
      descriptions.push(`Nassau match with $${amount} per side`);
    }
  }

  // Skins game parsing
  if (input.includes('skins')) {
    const amount = parseAmount(input, 'skins');
    if (amount) {
      result.type.push('skins');
      result.amounts.skins = amount;
      descriptions.push(`Skins at $${amount} per hole`);
    }
  }

  // Birdies parsing
  if (input.includes('birdie')) {
    const amount = parseAmount(input, 'birdie');
    if (amount) {
      result.type.push('birdies');
      result.amounts.birdies = amount;
      descriptions.push(`Birdies worth $${amount}`);
    }
  }

  // Eagles parsing
  if (input.includes('eagle')) {
    const amount = parseAmount(input, 'eagle');
    if (amount) {
      result.type.push('eagles');
      result.amounts.eagles = amount;
      descriptions.push(`Eagles worth $${amount}`);
    }
  }

  if (result.type.length === 0) return null;

  result.description = descriptions.join(', ');
  result.totalPayout = calculateTotalPotential(result.amounts);

  return result;
};

const parseAmount = (input: string, betType: string): number => {
  const pattern = new RegExp(`\\$?\\s*(\\d+)\\s*(?:${betType}|(?=\\s|$))`, 'i');
  const matches = input.match(pattern);
  return matches ? parseInt(matches[1]) : 0;
};

const calculateTotalPotential = (amounts: MatchResult['amounts']): number => {
  let total = 0;
  
  // Nassau: front 9, back 9, and total match
  if (amounts.nassau) {
    total += amounts.nassau * 3;
  }
  
  // Skins: potential skin on every hole
  if (amounts.skins) {
    total += amounts.skins * 18;
  }
  
  // Birdies: assume potential birdie on every hole
  if (amounts.birdies) {
    total += amounts.birdies * 18;
  }
  
  // Eagles: assume potential eagle on par 5s (typically 4 per round)
  if (amounts.eagles) {
    total += amounts.eagles * 4;
  }
  
  return total;
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
