
import { MatchResult } from "@/utils/match/types";
import { calculateNassauResults, calculateSkinsResults, calculateBirdieResults, calculateEagleResults } from "@/utils/match";
import { TeamScores, Player } from "@/types/golf";

export const handleMatchSetup = (
  result: MatchResult,
  teamScores: TeamScores,
  players: Player[],  // Changed from { name: string; team: string }[] to Player[]
  consolidatePayments: (payments: any[]) => any
) => {
  let details: any = {};
  let allPayments: any[] = [];
  let newHoleScores: { [key: number]: { [key: string]: number } } = {};

  if (result.amounts.nassau || result.amounts.nassauFront || result.amounts.nassauBack || result.amounts.nassauTotal) {
    const baseAmount = result.amounts.nassau || Math.max(
      result.amounts.nassauFront || 0,
      result.amounts.nassauBack || 0,
      result.amounts.nassauTotal || 0
    );
    
    const teams = Object.keys(teamScores);
    const teamResults = teams.map(team => {
      const front9Total = players
        .filter(p => p.team === team)
        .reduce((sum, player) => {
          const scores = player.scores.slice(0, 9);
          return sum + scores.reduce((s, score) => s + (score || 0), 0);
        }, 0);

      const back9Total = players
        .filter(p => p.team === team)
        .reduce((sum, player) => {
          const scores = player.scores.slice(9, 18);
          return sum + scores.reduce((s, score) => s + (score || 0), 0);
        }, 0);

      return {
        teamId: team,
        front9: front9Total,
        back9: back9Total,
        total: front9Total + back9Total
      };
    });

    // For now, only handle the first two teams for Nassau
    if (teamResults.length >= 2) {
      const nassauResults = calculateNassauResults(
        teamResults[0],
        teamResults[1],
        baseAmount,
        players.map(p => ({ name: p.name, team: p.team })),
        {
          front: result.amounts.nassauFront || baseAmount,
          back: result.amounts.nassauBack || baseAmount,
          total: result.amounts.nassauTotal || baseAmount
        }
      );

      details.nassau = nassauResults;
      if (nassauResults.payments) {
        allPayments.push(...nassauResults.payments);
      }
    }
  }

  if (result.amounts.skins) {
    const playerScores = players.map(player => player.scores);
    
    playerScores.forEach((scores, playerIndex) => {
      scores.forEach((score, holeIndex) => {
        if (!newHoleScores[holeIndex + 1]) {
          newHoleScores[holeIndex + 1] = {};
        }
        newHoleScores[holeIndex + 1][players[playerIndex].name] = score || 0;
      });
    });
    
    const skinsResults = calculateSkinsResults(playerScores, result.amounts.skins, players.map(p => ({ name: p.name, team: p.team })));
    details.skins = skinsResults;
    if (skinsResults.payments) {
      allPayments.push(...skinsResults.payments);
    }
  }

  if (result.amounts.birdies) {
    const playerScores = players.map(player => player.scores);
    const mockPars = Array(18).fill(4);
    const birdieResults = calculateBirdieResults(
      playerScores,
      mockPars,
      result.amounts.birdies,
      players.map(p => ({ name: p.name, team: p.team }))
    );
    details.birdies = birdieResults;
    if (birdieResults.payments) {
      allPayments.push(...birdieResults.payments);
    }
  }

  if (result.amounts.eagles) {
    const playerScores = players.map(player => player.scores);
    const mockPars = Array(18).fill(4);
    const eagleResults = calculateEagleResults(
      playerScores,
      mockPars,
      result.amounts.eagles,
      players.map(p => ({ name: p.name, team: p.team }))
    );
    details.eagles = eagleResults;
    if (eagleResults.payments) {
      allPayments.push(...eagleResults.payments);
    }
  }

  details.consolidatedPayments = consolidatePayments(allPayments);
  
  return {
    details,
    holeScores: newHoleScores
  };
};
