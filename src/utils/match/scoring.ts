
import { PaymentDetail, Player } from './types';

interface BirdieResult {
  birdies: Array<{ hole: number; player: string; amount: number }>;
  payments: PaymentDetail[];
}

interface EagleResult {
  eagles: Array<{ hole: number; player: string; amount: number }>;
  payments: PaymentDetail[];
}

export const calculateBirdieResults = (
  scores: number[][],
  pars: number[],
  amount: number,
  players: Player[]
): BirdieResult => {
  const results = {
    birdies: [] as Array<{ hole: number; player: string; amount: number }>,
    payments: [] as PaymentDetail[]
  };

  scores.forEach((playerScores, playerIndex) => {
    playerScores.forEach((score, holeIndex) => {
      if (score < pars[holeIndex]) {
        const birdieAmount = amount * (players.length - 1);
        results.birdies.push({
          hole: holeIndex + 1,
          player: players[playerIndex].name,
          amount: birdieAmount
        });

        // Add payment details
        players.forEach(player => {
          if (player.name !== players[playerIndex].name) {
            results.payments.push({
              from: player.name,
              to: players[playerIndex].name,
              amount: amount,
              reason: `Birdie on hole ${holeIndex + 1}`
            });
          }
        });
      }
    });
  });

  return results;
};

export const calculateEagleResults = (
  scores: number[][],
  pars: number[],
  amount: number,
  players: Player[]
): EagleResult => {
  const results = {
    eagles: [] as Array<{ hole: number; player: string; amount: number }>,
    payments: [] as PaymentDetail[]
  };

  scores.forEach((playerScores, playerIndex) => {
    playerScores.forEach((score, holeIndex) => {
      if (score <= pars[holeIndex] - 2) {
        const eagleAmount = amount * (players.length - 1);
        results.eagles.push({
          hole: holeIndex + 1,
          player: players[playerIndex].name,
          amount: eagleAmount
        });

        // Add payment details
        players.forEach(player => {
          if (player.name !== players[playerIndex].name) {
            results.payments.push({
              from: player.name,
              to: players[playerIndex].name,
              amount: amount,
              reason: `Eagle on hole ${holeIndex + 1}`
            });
          }
        });
      }
    });
  });

  return results;
};

export const calculateTeamScore = (
  scores: number[][],
  teamPlayers: Player[],
  format: 'aggregate' | 'best-ball' | 'two-best-balls',
  handicaps: number[] = []
): number[] => {
  const teamHoleScores: number[] = Array(scores[0].length).fill(0);

  scores[0].forEach((_, holeIndex) => {
    const holeScores = teamPlayers.map((_, playerIndex) => {
      const grossScore = scores[playerIndex][holeIndex];
      const handicapStrokes = handicaps[playerIndex] || 0;
      return grossScore - handicapStrokes;
    });

    switch (format) {
      case 'best-ball':
        teamHoleScores[holeIndex] = Math.min(...holeScores);
        break;
      case 'two-best-balls':
        const sortedScores = [...holeScores].sort((a, b) => a - b);
        teamHoleScores[holeIndex] = sortedScores[0] + sortedScores[1];
        break;
      case 'aggregate':
      default:
        teamHoleScores[holeIndex] = holeScores.reduce((sum, score) => sum + score, 0);
        break;
    }
  });

  return teamHoleScores;
};

// Function to calculate strokes given based on handicaps and percentage
export const calculateHandicapStrokes = (
  courseHandicap: number,
  percentage: number
): number => {
  return Math.round((courseHandicap * percentage) / 100);
};

