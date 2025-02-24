
import { PaymentDetail, Player } from './types';

interface SkinsResult {
  skins: Array<{ hole: number; winner: string; amount: number }>;
  payments: PaymentDetail[];
}

export const calculateSkinsResults = (
  scores: number[][],
  amount: number,
  players: Player[]
): SkinsResult => {
  const results = {
    skins: [] as Array<{ hole: number; winner: string; amount: number }>,
    payments: [] as PaymentDetail[]
  };

  scores[0].forEach((_, holeIndex) => {
    let lowestScore = Infinity;
    let lowestScorePlayers: string[] = [];

    // Find lowest score for the hole
    players.forEach((player, playerIndex) => {
      const score = scores[playerIndex][holeIndex];
      if (score < lowestScore) {
        lowestScore = score;
        lowestScorePlayers = [player.name];
      } else if (score === lowestScore) {
        lowestScorePlayers.push(player.name);
      }
    });

    // If only one player has lowest score, they win the skin
    if (lowestScorePlayers.length === 1) {
      results.skins.push({
        hole: holeIndex + 1,
        winner: lowestScorePlayers[0],
        amount: amount * (players.length - 1)
      });

      // Add payment details
      players.forEach(player => {
        if (player.name !== lowestScorePlayers[0]) {
          results.payments.push({
            from: player.name,
            to: lowestScorePlayers[0],
            amount: amount,
            reason: `Skin on hole ${holeIndex + 1}`
          });
        }
      });
    }
  });

  return results;
};
