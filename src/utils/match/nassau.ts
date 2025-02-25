
import { PaymentDetail, Player, TeamScores } from './types';

interface NassauResult {
  front9: { winner: string; amount: number };
  back9: { winner: string; amount: number };
  total: { winner: string; amount: number };
  totalPayout: number;
  payments: PaymentDetail[];
}

interface TeamResult {
  team: 'A' | 'B';
  score: number;
}

const determineWinner = (
  teamAScore: number,
  teamBScore: number,
  isMatchPlay: boolean
): TeamResult | null => {
  if (isMatchPlay) {
    // In match play, the lower score wins the hole
    if (teamAScore < teamBScore) {
      return { team: 'A', score: 1 };
    } else if (teamBScore < teamAScore) {
      return { team: 'B', score: 1 };
    }
    return null; // Halved hole
  } else {
    // In stroke play, we compare total strokes
    if (teamAScore < teamBScore) {
      return { team: 'A', score: teamBScore - teamAScore };
    } else if (teamBScore < teamAScore) {
      return { team: 'B', score: teamAScore - teamBScore };
    }
    return null; // Tied
  }
};

export const calculateNassauResults = (
  teamAScores: TeamScores,
  teamBScores: TeamScores,
  amount: number,
  players: Player[],
  isMatchPlay: boolean = false
): NassauResult => {
  const results = {
    front9: { winner: '', amount: 0 },
    back9: { winner: '', amount: 0 },
    total: { winner: '', amount: 0 },
    totalPayout: 0,
    payments: [] as PaymentDetail[]
  };

  const teamAPlayers = players.filter(p => p.team === 'A');
  const teamBPlayers = players.filter(p => p.team === 'B');

  // Calculate amount per player (total bet divided by number of players per team)
  const amountPerPlayer = amount / Math.min(teamAPlayers.length, teamBPlayers.length);

  // Front 9
  const front9Result = determineWinner(teamAScores.front9, teamBScores.front9, isMatchPlay);
  if (front9Result) {
    results.front9 = { 
      winner: `Team ${front9Result.team}`, 
      amount: isMatchPlay ? amount : amount * front9Result.score 
    };
    
    const winners = front9Result.team === 'A' ? teamAPlayers : teamBPlayers;
    const losers = front9Result.team === 'A' ? teamBPlayers : teamAPlayers;
    
    losers.forEach((loser, index) => {
      if (index < winners.length) {
        results.payments.push({
          from: loser.name,
          to: winners[index].name,
          amount: isMatchPlay ? amountPerPlayer : amountPerPlayer * front9Result.score,
          reason: 'Front 9'
        });
      }
    });
  }

  // Back 9
  const back9Result = determineWinner(teamAScores.back9, teamBScores.back9, isMatchPlay);
  if (back9Result) {
    results.back9 = { 
      winner: `Team ${back9Result.team}`, 
      amount: isMatchPlay ? amount : amount * back9Result.score 
    };
    
    const winners = back9Result.team === 'A' ? teamAPlayers : teamBPlayers;
    const losers = back9Result.team === 'A' ? teamBPlayers : teamAPlayers;
    
    losers.forEach((loser, index) => {
      if (index < winners.length) {
        results.payments.push({
          from: loser.name,
          to: winners[index].name,
          amount: isMatchPlay ? amountPerPlayer : amountPerPlayer * back9Result.score,
          reason: 'Back 9'
        });
      }
    });
  }

  // Total
  const totalResult = determineWinner(teamAScores.total, teamBScores.total, isMatchPlay);
  if (totalResult) {
    results.total = { 
      winner: `Team ${totalResult.team}`, 
      amount: isMatchPlay ? amount : amount * totalResult.score 
    };
    
    const winners = totalResult.team === 'A' ? teamAPlayers : teamBPlayers;
    const losers = totalResult.team === 'A' ? teamBPlayers : teamAPlayers;
    
    losers.forEach((loser, index) => {
      if (index < winners.length) {
        results.payments.push({
          from: loser.name,
          to: winners[index].name,
          amount: isMatchPlay ? amountPerPlayer : amountPerPlayer * totalResult.score,
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
