
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
