
import { MatchResult } from './types';

export const parseMatchInput = (input: string): MatchResult | null => {
  input = input.toLowerCase();
  const result: MatchResult = {
    type: [],
    scoringFormat: {
      type: 'stroke', // default to stroke play
      teamScoring: 'aggregate', // default to aggregate scoring
      handicapPercentage: 100, // default to full handicap
    },
    amounts: {},
    winners: [],
    losers: [],
    description: '',
    bets: []
  };

  // Parse separate Nassau amounts
  const frontMatch = input.match(/\$?(\d+)\s*(?:front|front ?9)/i);
  const backMatch = input.match(/\$?(\d+)\s*(?:back|back ?9)/i);
  const overallMatch = input.match(/\$?(\d+)\s*(?:overall|total)/i);

  // If we find any Nassau-related amounts, it's a Nassau bet
  if (frontMatch || backMatch || overallMatch) {
    result.type.push('nassau');
    
    if (frontMatch) {
      result.amounts.nassauFront = parseInt(frontMatch[1]);
      console.log('Parsed front amount:', result.amounts.nassauFront);
    }
    if (backMatch) {
      result.amounts.nassauBack = parseInt(backMatch[1]);
      console.log('Parsed back amount:', result.amounts.nassauBack);
    }
    if (overallMatch) {
      result.amounts.nassauTotal = parseInt(overallMatch[1]);
      console.log('Parsed total amount:', result.amounts.nassauTotal);
    }

    // Add a clear description of the Nassau bet
    result.bets.push(
      `Nassau: ${frontMatch ? `$${result.amounts.nassauFront} Front` : ''}${
        backMatch ? `${frontMatch ? ', ' : ''}$${result.amounts.nassauBack} Back` : ''}${
        overallMatch ? `${(frontMatch || backMatch) ? ', ' : ''}$${result.amounts.nassauTotal} Total` : ''}`
    );

    return result;
  }

  // Handle other betting patterns
  const betPatterns = {
    nassau: /\$?(\d+)\s*(?:nassau|nas)/i,
    skins: /\$?(\d+)\s*(?:skin|skins)/i,
    birdies: /\$?(\d+)\s*(?:birdie|birdies)/i,
    eagles: /\$?(\d+)\s*(?:eagle|eagles)/i
  };

  // Handle Nassau bets
  const nassauMatch = input.match(betPatterns.nassau);
  if (nassauMatch) {
    const amount = parseInt(nassauMatch[1]);
    console.log('Parsed uniform Nassau amount:', amount);
    result.type.push('nassau');
    result.amounts.nassau = amount;
    result.amounts.nassauFront = amount;
    result.amounts.nassauBack = amount;
    result.amounts.nassauTotal = amount;
    result.bets.push(
      `$${amount} Nassau (${result.scoringFormat.type === 'match' ? 'Match' : 'Stroke'} Play, ` +
      `${result.scoringFormat.teamScoring === 'best-ball' ? 'Best Ball' : 
        result.scoringFormat.teamScoring === 'two-best-balls' ? '2 Best Balls' : 
        result.scoringFormat.teamScoring === 'three-best-balls' ? '3 Best Balls' :
        'Aggregate'}, ` +
      `${result.scoringFormat.handicapPercentage}% Handicap)`
    );
  }

  // Handle Skins
  const skinsMatch = input.match(betPatterns.skins);
  if (skinsMatch) {
    const amount = parseInt(skinsMatch[1]);
    result.type.push('skins');
    result.amounts.skins = amount;
    result.bets.push(`$${amount} Skins (Gross)`);
  }

  // Handle Birdies
  const birdiesMatch = input.match(betPatterns.birdies);
  if (birdiesMatch) {
    const amount = parseInt(birdiesMatch[1]);
    result.type.push('birdies');
    result.amounts.birdies = amount;
    result.bets.push(`$${amount} Birdies (Gross)`);
  }

  // Handle Eagles
  const eaglesMatch = input.match(betPatterns.eagles);
  if (eaglesMatch) {
    const amount = parseInt(eaglesMatch[1]);
    result.type.push('eagles');
    result.amounts.eagles = amount;
    result.bets.push(`$${amount} Eagles (Gross)`);
  }

  // Only return result if at least one bet type was identified
  if (result.type.length === 0) return null;

  result.description = result.bets.join(' • ');
  console.log('Final parsed result:', result);

  return result;
};
