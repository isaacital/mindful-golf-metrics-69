
import { MatchResult } from "@/utils/match/types";
import { formatGameType, formatScoringFormat } from "../utils/formatters";

interface MatchConfigurationProps {
  matchResult: MatchResult;
}

export const MatchConfiguration = ({ matchResult }: MatchConfigurationProps) => {
  return (
    <div className="pb-4">
      <div className="mb-4 p-4 bg-white/80 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Match Configuration</h3>
        <div className="space-y-4">
          {matchResult.scoringFormat && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Scoring Format</div>
              <div className="text-sm text-gray-600">
                {formatScoringFormat(matchResult.scoringFormat)}
              </div>
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Wagers</div>
            <div className="flex flex-wrap gap-2">
              {matchResult.type.map((type, index) => (
                <span key={index} className="px-3 py-1.5 bg-primary/10 rounded-full text-xs font-medium text-primary">
                  {formatGameType(type, matchResult.amounts)}
                </span>
              ))}
            </div>
          </div>
          {matchResult.settings && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Additional Settings</div>
              <div className="text-sm text-gray-600">
                {matchResult.settings.teamFormat && (
                  <span className="mr-3">Format: {matchResult.settings.teamFormat}</span>
                )}
                {matchResult.settings.handicaps && (
                  <span className="mr-3">Handicaps: {matchResult.settings.handicaps}</span>
                )}
                {matchResult.settings.automaticPress && (
                  <span>Auto Press: {matchResult.settings.pressStartHole}-down</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {matchResult.bets?.map((bet, index) => (
          <div 
            key={index}
            className="px-3 py-1 bg-white/80 rounded-full text-sm font-medium shadow-sm border border-gray-100"
          >
            {bet}
          </div>
        ))}
      </div>
    </div>
  );
};
