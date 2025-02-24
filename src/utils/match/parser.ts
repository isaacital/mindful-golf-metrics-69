
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

  // Parse scoring format
  if (input.includes('match play')) {
    result.scoringFormat.type = 'match';
  }

  // Parse team scoring format
  if (input.includes('best ball')) {
    result.scoringFormat.teamScoring = 'best-ball';
  } else if (input.includes('2 best') || input.includes('two best')) {
    result.scoringFormat.teamScoring = 'two-best-balls';
  }

  // Parse handicap percentage
  if (input.includes('90%')) {
    result.scoringFormat.handicapPercentage = 90;
  } else if (input.includes('85%')) {
    result.scoringFormat.handicapPercentage = 85;
  } else if (input.includes('75%')) {
    result.scoringFormat.handicapPercentage = 75;
  } else if (input.includes('50%')) {
    result.scoringFormat.handicapPercentage = 50;
  } else if (input.includes('no handicap') || input.includes('gross')) {
    result.scoringFormat.handicapPercentage = 0;
  }

  // Parse all possible bets and add them to the bets array
  const nassauMatch = input.match(/\$(\d+)\s*nassau/);
  const skinsMatch = input.match(/\$(\d+)\s*skins/);
  const birdiesMatch = input.match(/\$(\d+)\s*birdie/);
  const eaglesMatch = input.match(/\$(\d+)\s*eagle/);

  if (nassauMatch) {
    const amount = parseInt(nassauMatch[1]);
    result.type.push('nassau');
    result.amounts.nassau = amount;
    result.bets.push(
      `$${amount} Nassau (${result.scoringFormat.type === 'match' ? 'Match' : 'Stroke'} Play, ` +
      `${result.scoringFormat.teamScoring === 'best-ball' ? 'Best Ball' : 
        result.scoringFormat.teamScoring === 'two-best-balls' ? '2 Best Balls' : 
        'Aggregate'}, ` +
      `${result.scoringFormat.handicapPercentage}% Handicap)`
    );
  }

  if (skinsMatch) {
    const amount = parseInt(skinsMatch[1]);
    result.type.push('skins');
    result.amounts.skins = amount;
    result.bets.push(`$${amount} Skins (Gross)`);
  }

  if (birdiesMatch) {
    const amount = parseInt(birdiesMatch[1]);
    result.type.push('birdies');
    result.amounts.birdies = amount;
    result.bets.push(`$${amount} Birdies (Gross)`);
  }

  if (eaglesMatch) {
    const amount = parseInt(eaglesMatch[1]);
    result.type.push('eagles');
    result.amounts.eagles = amount;
    result.bets.push(`$${amount} Eagles (Gross)`);
  }

  if (result.type.length === 0) return null;

  result.description = result.bets.join(' • ');

  return result;
};
