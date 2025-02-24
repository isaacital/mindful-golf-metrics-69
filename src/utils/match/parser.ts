
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

  // Parse all possible bets and add them to the bets array
  const nassauMatch = input.match(/\$(\d+)\s*nassau/);
  const skinsMatch = input.match(/\$(\d+)\s*skins/);
  const birdiesMatch = input.match(/\$(\d+)\s*birdie/);
  const eaglesMatch = input.match(/\$(\d+)\s*eagle/);

  if (nassauMatch) {
    const amount = parseInt(nassauMatch[1]);
    result.type.push('nassau');
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

  if (result.type.length === 0) return null;

  result.description = result.bets.join(' • ');

  return result;
};
