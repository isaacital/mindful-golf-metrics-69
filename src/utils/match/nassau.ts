
import { PaymentDetail, Player, TeamScores } from './types';

interface NassauResult {
  front9: { winner: string; amount: number };
  back9: { winner: string; amount: number };
  total: { winner: string; amount: number };
  totalPayout: number;
  payments: PaymentDetail[];
}

export const calculateNassauResults = (
  teamAScores: TeamScores,
  teamBScores: TeamScores,
  amount: number,
  players: Player[]
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

  // Front 9
  if (teamAScores.front9 < teamBScores.front9) {
    results.front9 = { winner: 'Team A', amount: amount * teamBPlayers.length };
    teamBPlayers.forEach(loser => {
      teamAPlayers.forEach(winner => {
        results.payments.push({
          from: loser.name,
          to: winner.name,
          amount: amount,
          reason: 'Front 9'
        });
      });
    });
  } else if (teamBScores.front9 < teamAScores.front9) {
    results.front9 = { winner: 'Team B', amount: amount * teamAPlayers.length };
    teamAPlayers.forEach(loser => {
      teamBPlayers.forEach(winner => {
        results.payments.push({
          from: loser.name,
          to: winner.name,
          amount: amount,
          reason: 'Front 9'
        });
      });
    });
  }

  // Back 9
  if (teamAScores.back9 < teamBScores.back9) {
    results.back9 = { winner: 'Team A', amount: amount * teamBPlayers.length };
    teamBPlayers.forEach(loser => {
      teamAPlayers.forEach(winner => {
        results.payments.push({
          from: loser.name,
          to: winner.name,
          amount: amount,
          reason: 'Back 9'
        });
      });
    });
  } else if (teamBScores.back9 < teamAScores.back9) {
    results.back9 = { winner: 'Team B', amount: amount * teamAPlayers.length };
    teamAPlayers.forEach(loser => {
      teamBPlayers.forEach(winner => {
        results.payments.push({
          from: loser.name,
          to: winner.name,
          amount: amount,
          reason: 'Back 9'
        });
      });
    });
  }

  // Total
  if (teamAScores.total < teamBScores.total) {
    results.total = { winner: 'Team A', amount: amount * teamBPlayers.length };
    teamBPlayers.forEach(loser => {
      teamAPlayers.forEach(winner => {
        results.payments.push({
          from: loser.name,
          to: winner.name,
          amount: amount,
          reason: 'Total Match'
        });
      });
    });
  } else if (teamBScores.total < teamAScores.total) {
    results.total = { winner: 'Team B', amount: amount * teamAPlayers.length };
    teamAPlayers.forEach(loser => {
      teamBPlayers.forEach(winner => {
        results.payments.push({
          from: loser.name,
          to: winner.name,
          amount: amount,
          reason: 'Total Match'
        });
      });
    });
  }

  results.totalPayout = 
    (results.front9.amount || 0) + 
    (results.back9.amount || 0) + 
    (results.total.amount || 0);

  return results;
};
