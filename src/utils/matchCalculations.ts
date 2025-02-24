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
  bets: string[];
}

interface PaymentDetail {
  from: string;
  to: string;
  amount: number;
  reason: string;
}

export const parseMatchInput = (input: string): MatchResult | null => {
  input = input.toLowerCase();
  const result: MatchResult = {
    type: [],
    amounts: {},
    winners: [],
    losers: [],
    totalPayout: 0,
    description: '',
    bets: []
  };

  // Parse all possible bets and add them to the bets array
  const nassauMatch = input.match(/\$(\d+)\s*nassau/);
  const skinsMatch = input.match(/\$(\d+)\s*skins/);
  const birdiesMatch = input.match(/\$(\d+)\s*birdie/);
  const eaglesMatch = input.match(/\$(\d+)\s*eagle/);

  if (nassauMatch) {
    const amount = parseInt(nassauMatch[1]);
    result.type.push('nassau');
    result.amounts.nassau = amount;
    result.bets.push(`$${amount} Nassau`);
  }

  if (skinsMatch) {
    const amount = parseInt(skinsMatch[1]);
    result.type.push('skins');
    result.amounts.skins = amount;
    result.bets.push(`$${amount} Skins per hole`);
  }

  if (birdiesMatch) {
    const amount = parseInt(birdiesMatch[1]);
    result.type.push('birdies');
    result.amounts.birdies = amount;
    result.bets.push(`$${amount} per Birdie`);
  }

  if (eaglesMatch) {
    const amount = parseInt(eaglesMatch[1]);
    result.type.push('eagles');
    result.amounts.eagles = amount;
    result.bets.push(`$${amount} per Eagle`);
  }

  if (result.type.length === 0) return null;

  result.description = result.bets.join(' • ');
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
  amount: number,
  players: { name: string; team: 'A' | 'B' }[]
) => {
  const results = {
    front9: { winner: '', amount: 0 },
    back9: { winner: '', amount: 0 },
    total: { winner: '', amount: 0 },
    totalPayout: 0,
    payments: [] as PaymentDetail[]
  };

  const teamAPlayers = players.filter(p => p.team === 'A');
  const teamBPlayers = players.filter(p => p.team === 'B');
  const amountPerPlayer = amount / Math.min(teamAPlayers.length, teamBPlayers.length);

  // Front 9
  if (teamAScores.front9 < teamBScores.front9) {
    results.front9 = { winner: 'Team A', amount };
    teamBPlayers.forEach((loser, idx) => {
      if (idx < teamAPlayers.length) {
        results.payments.push({
          from: loser.name,
          to: teamAPlayers[idx].name,
          amount: amountPerPlayer,
          reason: 'Front 9'
        });
      }
    });
  } else if (teamBScores.front9 < teamAScores.front9) {
    results.front9 = { winner: 'Team B', amount };
    teamAPlayers.forEach((loser, idx) => {
      if (idx < teamBPlayers.length) {
        results.payments.push({
          from: loser.name,
          to: teamBPlayers[idx].name,
          amount: amountPerPlayer,
          reason: 'Front 9'
        });
      }
    });
  }

  // Back 9
  if (teamAScores.back9 < teamBScores.back9) {
    results.back9 = { winner: 'Team A', amount };
    teamBPlayers.forEach((loser, idx) => {
      if (idx < teamAPlayers.length) {
        results.payments.push({
          from: loser.name,
          to: teamAPlayers[idx].name,
          amount: amountPerPlayer,
          reason: 'Back 9'
        });
      }
    });
  } else if (teamBScores.back9 < teamAScores.back9) {
    results.back9 = { winner: 'Team B', amount };
    teamAPlayers.forEach((loser, idx) => {
      if (idx < teamBPlayers.length) {
        results.payments.push({
          from: loser.name,
          to: teamBPlayers[idx].name,
          amount: amountPerPlayer,
          reason: 'Back 9'
        });
      }
    });
  }

  // Total
  if (teamAScores.total < teamBScores.total) {
    results.total = { winner: 'Team A', amount };
    teamBPlayers.forEach((loser, idx) => {
      if (idx < teamAPlayers.length) {
        results.payments.push({
          from: loser.name,
          to: teamAPlayers[idx].name,
          amount: amountPerPlayer,
          reason: 'Total Match'
        });
      }
    });
  } else if (teamBScores.total < teamAScores.total) {
    results.total = { winner: 'Team B', amount };
    teamAPlayers.forEach((loser, idx) => {
      if (idx < teamBPlayers.length) {
        results.payments.push({
          from: loser.name,
          to: teamBPlayers[idx].name,
          amount: amountPerPlayer,
          reason: 'Total Match'
        });
      }
    });
  }

  results.totalPayout = 
    (results.front9.amount || 0) + 
    (results.back9.amount || 0) + 
    (results.total.amount || 0);

  return results;
};
