
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
  const nassauShorthandMatch = input.match(/(\d+)\/(\d+)\/(\d+)/);
  if (nassauShorthandMatch) {
    const [_, front9, back9, total] = nassauShorthandMatch;
    if (!result.type.includes('nassau')) {
      result.type.push('nassau');
      const pressBet = parseInt(front9);
      result.amounts.nassau = pressBet;
      result.bets.push(`$${pressBet} Nassau ($${front9} front, $${back9} back, $${total} total)`);
    }
  }

  // Handle various Nassau descriptions with flexible matching
  const nassauPatterns = [
    /\$?(\d+)\s*nassau/i,
    /nassau\s*\$?(\d+)/i,
    /(\d+)\s*dollar\s*nassau/i,
    /bet\s*\$?(\d+)/i,
    /play\s*for\s*\$?(\d+)/i,
    /wager\s*\$?(\d+)/i
  ];

  for (const pattern of nassauPatterns) {
    const match = input.match(pattern);
    if (match && !result.type.includes('nassau')) {
      result.type.push('nassau');
      const amount = parseInt(match[1]);
      result.amounts.nassau = amount;
      result.bets.push(`$${amount} Nassau`);
      break;
    }
  }

  // Handle various skins descriptions
  const skinsPatterns = [
    /\$?(\d+)\s*skins?/i,
    /skins?\s*\$?(\d+)/i,
    /(\d+)\s*dollars?\s*(?:per\s*)?skins?/i
  ];

  for (const pattern of skinsPatterns) {
    const match = input.match(pattern);
    if (match && !result.type.includes('skins')) {
      const amount = parseInt(match[1]);
      result.type.push('skins');
      result.amounts.skins = amount;
      result.bets.push(`$${amount} Skins per hole`);
      break;
    }
  }

  // Handle various birdie descriptions
  const birdiePatterns = [
    /\$?(\d+)\s*bird(?:ie)?s?/i,
    /bird(?:ie)?s?\s*\$?(\d+)/i,
    /(\d+)\s*dollars?\s*(?:per\s*)?bird(?:ie)?s?/i
  ];

  for (const pattern of birdiePatterns) {
    const match = input.match(pattern);
    if (match && !result.type.includes('birdies')) {
      const amount = parseInt(match[1]);
      result.type.push('birdies');
      result.amounts.birdies = amount;
      result.bets.push(`$${amount} per Birdie`);
      break;
    }
  }

  // Handle various eagle descriptions
  const eaglePatterns = [
    /\$?(\d+)\s*eagles?/i,
    /eagles?\s*\$?(\d+)/i,
    /(\d+)\s*dollars?\s*(?:per\s*)?eagles?/i
  ];

  for (const pattern of eaglePatterns) {
    const match = input.match(pattern);
    if (match && !result.type.includes('eagles')) {
      const amount = parseInt(match[1]);
      result.type.push('eagles');
      result.amounts.eagles = amount;
      result.bets.push(`$${amount} per Eagle`);
      break;
    }
  }

  // Try to extract any numeric values if no specific bet type was found
  if (result.type.length === 0) {
    const numericMatch = input.match(/\$?(\d+)/);
    if (numericMatch) {
      result.type.push('nassau'); // Default to Nassau if we just find a number
      const amount = parseInt(numericMatch[1]);
      result.amounts.nassau = amount;
      result.bets.push(`$${amount} Nassau`);
    }
  }

  // Only return null if absolutely no valid bet information could be extracted
  if (result.type.length === 0) return null;

  result.description = result.bets.join(' • ');

  return result;
};
