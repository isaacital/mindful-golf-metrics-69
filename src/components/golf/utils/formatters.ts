
import { MatchResult } from "@/utils/match/types";

export const formatGameType = (type: string, amounts: Record<string, number>) => {
  const words = type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  const formattedType = words.join(' ');
  const amount = amounts[type.toLowerCase()] || amounts[type];
  return amount ? `${formattedType} ($${amount})` : formattedType;
};

export const formatScoringFormat = (format: MatchResult['scoringFormat'] | undefined) => {
  if (!format) return '';
  
  const parts = [];
  
  // Add scoring type (Match vs Stroke)
  parts.push(format.type === 'match' ? 'Match Play' : 'Stroke Play');
  
  // Add team scoring format if applicable
  switch (format.teamScoring) {
    case 'best-ball':
      parts.push('Best Ball');
      break;
    case 'two-best-balls':
      parts.push('2 Best Balls');
      break;
    case 'three-best-balls':
      parts.push('3 Best Balls');
      break;
    case 'aggregate':
      parts.push('Aggregate');
      break;
  }
  
  // Add handicap percentage if not 100%
  if (format.handicapPercentage !== 100) {
    if (format.handicapPercentage === 0) {
      parts.push('No Handicap');
    } else {
      parts.push(`${format.handicapPercentage}% Handicap`);
    }
  }
  
  return parts.join(' • ');
};
