
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
  players: { name: string; team: 'A' | 'B' }[];
}

export const MatchSetup = ({ teamScores, players }: MatchSetupProps) => {
  const [matchInput, setMatchInput] = useState("");
  const [matchResult, setMatchResult] = useState<any>(null);

  const handleMatchSetup = () => {
    const result = parseMatchInput(matchInput);
    
    if (!result) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid match details (e.g., '$10 Nassau with $5 skins, birdies $2')",
        variant: "destructive",
      });
      return;
    }

    let details = {};
    if (result.amounts.nassau) {
      details = {
        ...details,
        nassau: calculateNassauResults(
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
        )
      };
    }

    setMatchResult({ ...result, details });

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
            placeholder="Enter match details (e.g., '$10 Nassau with $5 skins, birdies $2')"
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
            {matchResult.details?.nassau && (
              <div className="mt-2">
                <h4 className="font-semibold">Nassau Results:</h4>
                <p>Front 9: {matchResult.details.nassau.front9.winner} (${matchResult.details.nassau.front9.amount})</p>
                <p>Back 9: {matchResult.details.nassau.back9.winner} (${matchResult.details.nassau.back9.amount})</p>
                <p>Total: {matchResult.details.nassau.total.winner} (${matchResult.details.nassau.total.amount})</p>
                
                <div className="mt-2 space-y-2">
                  <h4 className="font-semibold">Payment Details:</h4>
                  {matchResult.details.nassau.payments.map((payment: any, index: number) => (
                    <div key={index} className="text-sm">
                      <span className="text-red-500">{payment.from}</span> owes{' '}
                      <span className="text-green-600">{payment.to}</span>{' '}
                      ${payment.amount} ({payment.reason})
                    </div>
                  ))}
                </div>
              </div>
            )}
            {matchResult.amounts.skins && (
              <div className="mt-2">
                <h4 className="font-semibold">Skins:</h4>
                <p>${matchResult.amounts.skins} per skin</p>
              </div>
            )}
            {(matchResult.amounts.birdies || matchResult.amounts.eagles) && (
              <div className="mt-2">
                <h4 className="font-semibold">Bonus Payouts:</h4>
                {matchResult.amounts.birdies && <p>Birdies: ${matchResult.amounts.birdies} each</p>}
                {matchResult.amounts.eagles && <p>Eagles: ${matchResult.amounts.eagles} each</p>}
              </div>
            )}
            <p className="font-bold mt-2">Maximum Potential Payout: ${matchResult.totalPayout}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
