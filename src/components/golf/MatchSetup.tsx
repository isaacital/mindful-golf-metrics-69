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
import { motion } from "framer-motion";

interface MatchSetupProps {
  teamScores: {
    A: { gross: number; net: number };
    B: { gross: number; net: number };
  };
  players: { name: string; team: 'A' | 'B' }[];
}

interface ConsolidatedPayment {
  amount: number;
  reasons: string[];
  from: string;
  to: string;
}

export const MatchSetup = ({ teamScores, players }: MatchSetupProps) => {
  const [matchInput, setMatchInput] = useState("");
  const [matchResult, setMatchResult] = useState<any>(null);

  const consolidatePayments = (payments: Array<{ from: string; to: string; amount: number; reason: string }>) => {
    const netAmounts = new Map<string, number>();
    
    payments.forEach(payment => {
      netAmounts.set(payment.from, (netAmounts.get(payment.from) || 0) - payment.amount);
      netAmounts.set(payment.to, (netAmounts.get(payment.to) || 0) + payment.amount);
    });

    const balances = Array.from(netAmounts.entries()).map(([player, amount]) => ({ player, amount }));
    const creditors = balances.filter(b => b.amount > 0).sort((a, b) => b.amount - a.amount);
    const debtors = balances.filter(b => b.amount < 0).sort((a, b) => a.amount - b.amount);

    const optimizedPayments: Array<{from: string; payees: Array<{to: string; amount: number}>}> = [];
    let creditorIndex = 0;
    let debtorIndex = 0;

    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];
      
      const amount = Math.min(creditor.amount, -debtor.amount);
      
      const existingDebtor = optimizedPayments.find(p => p.from === debtor.player);
      if (existingDebtor) {
        existingDebtor.payees.push({
          to: creditor.player,
          amount: amount
        });
      } else {
        optimizedPayments.push({
          from: debtor.player,
          payees: [{
            to: creditor.player,
            amount: amount
          }]
        });
      }

      creditor.amount -= amount;
      debtor.amount += amount;

      if (Math.abs(creditor.amount) < 0.01) creditorIndex++;
      if (Math.abs(debtor.amount) < 0.01) debtorIndex++;
    }

    const debtSummary = new Map<string, Set<string>>();
    payments.forEach(payment => {
      if (!debtSummary.has(payment.from)) {
        debtSummary.set(payment.from, new Set());
      }
      debtSummary.get(payment.from)?.add(payment.reason);
    });

    return optimizedPayments.map(payment => ({
      from: payment.from,
      payees: payment.payees.map(payee => ({
        to: payee.to,
        amount: payee.amount,
        reason: `Settlement for: ${Array.from(debtSummary.get(payment.from) || []).join(', ')}`
      }))
    }));
  };

  const handleMatchSetup = () => {
    const result = parseMatchInput(matchInput);
    
    if (!result) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid match details (e.g., '$5 Nassau, birdies $1, eagles $3, skins $2')",
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
            placeholder="Enter match details (e.g., '$5 Nassau, birdies $1, eagles $3, skins $2')"
            value={matchInput}
            onChange={(e) => setMatchInput(e.target.value)}
            className="flex-1 bg-white/80"
          />
          <Button onClick={handleMatchSetup} className="whitespace-nowrap">Set Match</Button>
        </div>

        {matchResult && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 divide-y divide-gray-100"
          >
            <div className="pb-4">
              <div className="flex flex-wrap gap-2">
                {matchResult.bets?.map((bet: string, index: number) => (
                  <div 
                    key={index}
                    className="px-3 py-1 bg-white/80 rounded-full text-sm font-medium border border-gray-200"
                  >
                    {bet}
                  </div>
                ))}
              </div>
            </div>

            {matchResult.details?.nassau && (
              <div className="pt-4 space-y-4">
                <h4 className="text-sm font-medium mb-2">Nassau Results</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-white/80 rounded-lg">
                    <div className="text-xs text-muted-foreground">Front 9</div>
                    <div className="font-medium">{matchResult.details.nassau.front9.winner}</div>
                    <div className="text-sm font-semibold text-green-600">${matchResult.details.nassau.front9.amount}</div>
                  </div>
                  <div className="p-3 bg-white/80 rounded-lg">
                    <div className="text-xs text-muted-foreground">Back 9</div>
                    <div className="font-medium">{matchResult.details.nassau.back9.winner}</div>
                    <div className="text-sm font-semibold text-green-600">${matchResult.details.nassau.back9.amount}</div>
                  </div>
                  <div className="p-3 bg-white/80 rounded-lg">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="font-medium">{matchResult.details.nassau.total.winner}</div>
                    <div className="text-sm font-semibold text-green-600">${matchResult.details.nassau.total.amount}</div>
                  </div>
                </div>
              </div>
            )}

            {matchResult.details?.skins?.skins?.length > 0 && (
              <div className="pt-4 space-y-2">
                <h4 className="text-sm font-medium mb-2">Skins Results</h4>
                {matchResult.details.skins.skins.map((skin: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white/80 rounded-lg">
                    <span className="text-sm">
                      Hole {skin.hole} - {skin.winner}
                    </span>
                    <span className="text-sm font-semibold text-green-600">${skin.amount}</span>
                  </div>
                ))}
              </div>
            )}

            {matchResult.details?.birdies?.birdies?.length > 0 && (
              <div className="pt-4 space-y-2">
                <h4 className="text-sm font-medium mb-2">Birdie Results</h4>
                {matchResult.details.birdies.birdies.map((birdie: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white/80 rounded-lg">
                    <span className="text-sm">
                      Hole {birdie.hole} - {birdie.player}
                    </span>
                    <span className="text-sm font-semibold text-green-600">${birdie.amount}</span>
                  </div>
                ))}
              </div>
            )}

            {matchResult.details?.eagles?.eagles?.length > 0 && (
              <div className="pt-4 space-y-2">
                <h4 className="text-sm font-medium mb-2">Eagle Results</h4>
                {matchResult.details.eagles.eagles.map((eagle: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white/80 rounded-lg">
                    <span className="text-sm">
                      Hole {eagle.hole} - {eagle.player}
                    </span>
                    <span className="text-sm font-semibold text-green-600">${eagle.amount}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">Final Payment Summary</h4>
              <div className="space-y-4">
                {matchResult.details.consolidatedPayments?.map((payment: any, index: number) => (
                  <div key={index} className="p-3 bg-white/80 rounded-lg">
                    <div className="text-sm font-medium text-red-500 mb-2">
                      {payment.from} owes:
                    </div>
                    <div className="space-y-2 pl-4">
                      {payment.payees.map((payee: any, pIndex: number) => (
                        <div key={pIndex} className="text-sm flex items-center justify-between">
                          <div>
                            <span className="text-green-600 font-medium">{payee.to}</span>
                            <span className="text-xs text-muted-foreground ml-2">({payee.reason})</span>
                          </div>
                          <div className="font-semibold">${payee.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
