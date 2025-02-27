
import { MatchResult, Player, TeamScores as MatchTeamScores } from "@/utils/match/types";
import { calculateNassauResults, calculateSkinsResults, calculateBirdieResults, calculateEagleResults } from "@/utils/match";
import { TeamScores } from "@/types/golf";

export const handleMatchSetup = (
  result: MatchResult,
  teamScores: TeamScores,
  players: { name: string; team: string }[],
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
    const teamResults = teams.map(team => ({
      team,
      front9: teamScores[team].gross,
      back9: teamScores[team].gross,
      total: teamScores[team].gross
    }));

    // For now, only handle the first two teams for Nassau
    if (teamResults.length >= 2) {
      const nassauResults = calculateNassauResults(
        teamResults[0],
        teamResults[1],
        baseAmount,
        players,
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
    const mockScores = players.map((_, playerIndex) => 
      Array(18).fill(0).map((_, holeIndex) => {
        if (playerIndex === 0 && (holeIndex === 3 || holeIndex === 12)) {
          return 3;
        }
        if (playerIndex === 1 && holeIndex === 7) {
          return 3;
        }
        return 4 + Math.floor(Math.random() * 3);
      })
    );
    
    mockScores.forEach((playerScores, playerIndex) => {
      playerScores.forEach((score, holeIndex) => {
        if (!newHoleScores[holeIndex + 1]) {
          newHoleScores[holeIndex + 1] = {};
        }
        newHoleScores[holeIndex + 1][players[playerIndex].name] = score;
      });
    });
    
    const skinsResults = calculateSkinsResults(mockScores, result.amounts.skins, players);
    details.skins = skinsResults;
    if (skinsResults.payments) {
      allPayments.push(...skinsResults.payments);
    }
  }

  if (result.amounts.birdies) {
    const mockScores = players.map((_, playerIndex) => 
      Array(18).fill(0).map((_, holeIndex) => {
        if (playerIndex === 0 && (holeIndex === 2 || holeIndex === 11)) {
          return 3;
        }
        if (playerIndex === 1 && holeIndex === 8) {
          return 3;
        }
        return 4;
      })
    );
    const mockPars = Array(18).fill(4);
    const birdieResults = calculateBirdieResults(mockScores, mockPars, result.amounts.birdies, players);
    details.birdies = birdieResults;
    if (birdieResults.payments) {
      allPayments.push(...birdieResults.payments);
    }
  }

  if (result.amounts.eagles) {
    const mockScores = players.map((_, playerIndex) => 
      Array(18).fill(0).map((_, holeIndex) => {
        if (playerIndex === 0 && holeIndex === 5) {
          return 2;
        }
        return 4;
      })
    );
    const mockPars = Array(18).fill(4);
    const eagleResults = calculateEagleResults(mockScores, mockPars, result.amounts.eagles, players);
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
