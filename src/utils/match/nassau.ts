
import { PaymentDetail, Player, TeamScore } from './types';

interface NassauResult {
  front9: { winner: string; amount: number };
  back9: { winner: string; amount: number };
  total: { winner: string; amount: number };
  totalPayout: number;
  payments: PaymentDetail[];
}

export const calculateNassauResults = (
  teamScores: TeamScore,
  opponentScores: TeamScore,
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

  const teamAPlayers = players.filter(p => p.team === teamScores.teamId);
  const teamBPlayers = players.filter(p => p.team === opponentScores.teamId);

  // Front 9
  if (teamScores.front9 < opponentScores.front9) {
    results.front9 = { winner: `Team ${teamScores.teamId}`, amount: frontAmount };
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
  } else if (opponentScores.front9 < teamScores.front9) {
    results.front9 = { winner: `Team ${opponentScores.teamId}`, amount: frontAmount };
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
  if (teamScores.back9 < opponentScores.back9) {
    results.back9 = { winner: `Team ${teamScores.teamId}`, amount: backAmount };
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
  } else if (opponentScores.back9 < teamScores.back9) {
    results.back9 = { winner: `Team ${opponentScores.teamId}`, amount: backAmount };
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
  if (teamScores.total < opponentScores.total) {
    results.total = { winner: `Team ${teamScores.teamId}`, amount: totalAmount };
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
  } else if (opponentScores.total < teamScores.total) {
    results.total = { winner: `Team ${opponentScores.teamId}`, amount: totalAmount };
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
