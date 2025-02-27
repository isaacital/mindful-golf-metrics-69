
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
  players: Player[],
  amounts?: { front?: number; back?: number; total?: number }
): NassauResult => {
  const results = {
    front9: { winner: '', amount: 0 },
    back9: { winner: '', amount: 0 },
    total: { winner: '', amount: 0 },
    totalPayout: 0,
    payments: [] as PaymentDetail[]
  };

  const frontAmount = amounts?.front ?? amount;
  const backAmount = amounts?.back ?? amount;
  const totalAmount = amounts?.total ?? amount;

  const teamAPlayers = players.filter(p => p.team === 'A');
  const teamBPlayers = players.filter(p => p.team === 'B');

  // Front 9
  if (teamAScores.front9 < teamBScores.front9) {
    results.front9 = { winner: 'Team A', amount: frontAmount };
    teamBPlayers.forEach((loser, index) => {
      if (index < teamAPlayers.length) {
        results.payments.push({
          from: loser.name,
          to: teamAPlayers[index].name,
          amount: frontAmount,
          reason: 'Front 9'
        });
      }
    });
  } else if (teamBScores.front9 < teamAScores.front9) {
    results.front9 = { winner: 'Team B', amount: frontAmount };
    teamAPlayers.forEach((loser, index) => {
      if (index < teamBPlayers.length) {
        results.payments.push({
          from: loser.name,
          to: teamBPlayers[index].name,
          amount: frontAmount,
          reason: 'Front 9'
        });
      }
    });
  }

  // Back 9
  if (teamAScores.back9 < teamBScores.back9) {
    results.back9 = { winner: 'Team A', amount: backAmount };
    teamBPlayers.forEach((loser, index) => {
      if (index < teamAPlayers.length) {
        results.payments.push({
          from: loser.name,
          to: teamAPlayers[index].name,
          amount: backAmount,
          reason: 'Back 9'
        });
      }
    });
  } else if (teamBScores.back9 < teamAScores.back9) {
    results.back9 = { winner: 'Team B', amount: backAmount };
    teamAPlayers.forEach((loser, index) => {
      if (index < teamBPlayers.length) {
        results.payments.push({
          from: loser.name,
          to: teamBPlayers[index].name,
          amount: backAmount,
          reason: 'Back 9'
        });
      }
    });
  }

  // Total
  if (teamAScores.total < teamBScores.total) {
    results.total = { winner: 'Team A', amount: totalAmount };
    teamBPlayers.forEach((loser, index) => {
      if (index < teamAPlayers.length) {
        results.payments.push({
          from: loser.name,
          to: teamAPlayers[index].name,
          amount: totalAmount,
          reason: 'Total Match'
        });
      }
    });
  } else if (teamBScores.total < teamAScores.total) {
    results.total = { winner: 'Team B', amount: totalAmount };
    teamAPlayers.forEach((loser, index) => {
      if (index < teamBPlayers.length) {
        results.payments.push({
          from: loser.name,
          to: teamBPlayers[index].name,
          amount: totalAmount,
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
