
import { MatchResult } from './types';

export const parseMatchInput = (input: string): MatchResult | null => {
  input = input.toLowerCase();
  const result: MatchResult = {
    type: [],
    amounts: {},
    winners: [],
    losers: [],
    description: '',
    bets: []
  };

  // Handle Nassau x/x/x format (e.g., "5/5/10" or "2/2/4")
  const nassauShorthandMatch = input.match(/^\s*(\d+)\/(\d+)\/(\d+)\s*$/);
  if (nassauShorthandMatch) {
    const [_, front9, back9, total] = nassauShorthandMatch;
    result.type.push('nassau');
    // In a traditional Nassau, front9 and back9 amounts are typically the same
    const pressBet = parseInt(front9);
    result.amounts.nassau = pressBet;
    result.bets.push(`$${pressBet} Nassau ($${front9} front, $${back9} back, $${total} total)`);
    return result;
  }

  // Handle original format parsing
  const nassauMatch = input.match(/\$?(\d+)\s*nassau/);
  const skinsMatch = input.match(/\$?(\d+)\s*skins?/);
  const birdiesMatch = input.match(/\$?(\d+)\s*birdie/);
  const eaglesMatch = input.match(/\$?(\d+)\s*eagle/);

  // Handle variations of Nassau descriptions
  const alternateNassauMatch = input.match(/nassau\s*\$?(\d+)/);
  const nassauAmount = nassauMatch?.[1] || alternateNassauMatch?.[1];

  if (nassauAmount) {
    result.type.push('nassau');
    const amount = parseInt(nassauAmount);
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

  // Parse combined formats (e.g., "5/5/10 skins 2" or "2/2/4 birdies 1")
  const combinedNassauMatch = input.match(/(\d+)\/(\d+)\/(\d+)/);
  if (combinedNassauMatch && !nassauShorthandMatch) {
    const [_, front9, back9, total] = combinedNassauMatch;
    if (!result.type.includes('nassau')) {
      result.type.push('nassau');
      const pressBet = parseInt(front9);
      result.amounts.nassau = pressBet;
      result.bets.push(`$${pressBet} Nassau ($${front9} front, $${back9} back, $${total} total)`);
    }
  }

  if (result.type.length === 0) return null;

  result.description = result.bets.join(' • ');

  return result;
};
