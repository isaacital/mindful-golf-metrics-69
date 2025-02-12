
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parseMatchInput, calculateNassauResults } from "@/utils/matchCalculations";
import { toast } from "@/components/ui/use-toast";

interface MatchSetupProps {
  teamScores: {
    A: { gross: number; net: number };
    B: { gross: number; net: number };
  };
}

export const MatchSetup = ({ teamScores }: MatchSetupProps) => {
  const [matchInput, setMatchInput] = useState("");
  const [matchResult, setMatchResult] = useState<any>(null);

  const handleMatchSetup = () => {
    const result = parseMatchInput(matchInput);
    
    if (!result) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid match format (e.g., '$10 Nassau' or '$5 skins')",
        variant: "destructive",
      });
      return;
    }

    if (result.type === 'nassau') {
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
        result.amount
      );
      setMatchResult({ ...result, details: nassauResults });
    }

    toast({
      title: "Match Setup",
      description: result.description,
    });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Match Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Input
            placeholder="Enter match details (e.g., '$10 Nassau' or '$5 skins')"
            value={matchInput}
            onChange={(e) => setMatchInput(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleMatchSetup}>Set Match</Button>
        </div>

        {matchResult && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Match Details:</h3>
            <p>{matchResult.description}</p>
            {matchResult.details && (
              <div className="mt-2">
                <p>Front 9: {matchResult.details.front9.winner} ({matchResult.details.front9.amount})</p>
                <p>Back 9: {matchResult.details.back9.winner} ({matchResult.details.back9.amount})</p>
                <p>Total: {matchResult.details.total.winner} ({matchResult.details.total.amount})</p>
                <p className="font-bold mt-2">Total Payout: ${matchResult.details.totalPayout}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
