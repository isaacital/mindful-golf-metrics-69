
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

  // Parse scoring format - check for match play first
  const matchPlayPatterns = ['match play', 'match-play', 'matchplay'];
  if (matchPlayPatterns.some(pattern => input.includes(pattern))) {
    result.scoringFormat.type = 'match';
  }

  // Parse team scoring format - check most specific patterns first
  // Handle variations of best ball formats
  const bestBallPatterns = {
    three: ['3 best ball', 'three best ball', '3 best-ball', 'three best-ball', '3bb'],
    two: ['2 best ball', 'two best ball', '2 best-ball', 'two best-ball', '2bb'],
    one: ['best ball', 'best-ball', 'bb', '1 best ball', 'one best ball']
  };

  if (bestBallPatterns.three.some(pattern => input.includes(pattern))) {
    result.scoringFormat.teamScoring = 'three-best-balls';
  } else if (bestBallPatterns.two.some(pattern => input.includes(pattern))) {
    result.scoringFormat.teamScoring = 'two-best-balls';
  } else if (bestBallPatterns.one.some(pattern => input.includes(pattern))) {
    result.scoringFormat.teamScoring = 'best-ball';
  }

  // Parse handicap percentage with more variations
  const handicapPatterns = {
    90: ['90%', '90 percent', '90 pct', 'ninety percent'],
    85: ['85%', '85 percent', '85 pct', 'eighty-five percent'],
    75: ['75%', '75 percent', '75 pct', 'seventy-five percent'],
    50: ['50%', '50 percent', '50 pct', 'half', 'fifty percent'],
    0: ['no handicap', 'gross', 'scratch', '0%', 'zero handicap']
  };

  for (const [percentage, patterns] of Object.entries(handicapPatterns)) {
    if (patterns.some(pattern => input.includes(pattern))) {
      result.scoringFormat.handicapPercentage = parseInt(percentage) as 100 | 90 | 85 | 75 | 50 | 0;
      break;
    }
  }

  // Parse all possible bets with more flexible patterns
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
    result.type.push('nassau');
    result.amounts.nassau = amount;
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

  return result;
};
