
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  parseMatchInput, 
  calculateNassauResults,
  calculateSkinsResults,
  calculateBirdieResults,
  calculateEagleResults
} from "@/utils/match";
import { toast } from "@/components/ui/use-toast";
import { TeamScores, Player } from "@/types/match";
import { consolidatePayments } from "@/utils/PaymentUtils";
import { MatchResultDisplay } from "./MatchResultDisplay";

interface MatchSetupProps {
  teamScores: TeamScores;
  players: Player[];
}

export const MatchSetup = ({ teamScores, players }: MatchSetupProps) => {
  const [matchInput, setMatchInput] = useState("");
  const [matchResult, setMatchResult] = useState<any>(null);

  const handleMatchSetup = () => {
    if (!matchInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter match details",
        variant: "destructive",
      });
      return;
    }

    const result = parseMatchInput(matchInput);
    
    if (!result) {
      toast({
        title: "No Valid Bets Found",
        description: "Could not detect any valid bet amounts in your input. Try something like '5 Nassau' or '5/5/10'",
        variant: "destructive",
      });
      return;
    }

    let details: any = {};
    let allPayments: any[] = [];

    if (result.amounts.nassau) {
      const nassauResults = calculateNassauResults(
        {
          front9: teamScores.A.gross,
          back9: teamScores.A.gross,
          total: teamScores.A.gross
        },
        {
          front9: teamScores.B.gross,
          back9: teamScores.B.gross,
          total: teamScores.B.gross
        },
        result.amounts.nassau,
        players
      );

      details.nassau = nassauResults;
      allPayments.push(...nassauResults.payments);
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

    setMatchResult({ ...result, details });

    toast({
      title: "Match Setup",
      description: "Match details have been set successfully",
    });
  };

  return (
    <Card className="mt-4 bg-white/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Match Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-6">
          <Input
            placeholder="Enter match details (e.g., '5/5/10' or '$5 Nassau, birdies $1, eagles $3, skins $2')"
            value={matchInput}
            onChange={(e) => setMatchInput(e.target.value)}
            className="flex-1 bg-white/80"
          />
          <Button onClick={handleMatchSetup} className="whitespace-nowrap">Set Match</Button>
        </div>

        <MatchResultDisplay matchResult={matchResult} />
      </CardContent>
    </Card>
  );
};
