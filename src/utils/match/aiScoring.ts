
import { supabase } from "@/integrations/supabase/client";
import { MatchResult, Player } from "./types";

export const calculateMatchResultsWithAI = async (
  match: {
    type: string[];
    amounts: Record<string, number>;
    settings?: Record<string, any>;
  },
  players: Player[],
  scores: number[][],
  pars: number[]
): Promise<MatchResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('calculate-match-scores', {
      body: { match, players, scores, pars }
    });

    if (error) {
      console.error("Error calculating match results:", error);
      throw error;
    }

    // The AI response already matches our MatchResult type
    return data as MatchResult;
  } catch (error) {
    console.error("Failed to calculate match results:", error);
    throw error;
  }
};
