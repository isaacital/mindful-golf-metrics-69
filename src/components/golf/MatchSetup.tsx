import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MatchSetupChat } from "./MatchSetupChat";
import { NassauResults } from "./match-results/NassauResults";
import { SkinsResults } from "./match-results/SkinsResults";
import { BirdieResults } from "./match-results/BirdieResults";
import { EagleResults } from "./match-results/EagleResults";
import { PaymentSummary } from "./match-results/PaymentSummary";
import { MatchResult } from "@/utils/match/types";

interface MatchSetupProps {
  teamScores: {
    A: { gross: number; net: number };
    B: { gross: number; net: number };
  };
  players: { name: string; team: 'A' | 'B' }[];
}

export const MatchSetup = ({ teamScores, players }: MatchSetupProps) => {
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [holeScores, setHoleScores] = useState<{ [key: number]: { [key: string]: number } }>({});

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

  const handleMatchSetup = (result: MatchResult) => {
    setMatchResult(result);
    let details: any = {};
    let allPayments: any[] = [];
    let newHoleScores: { [key: number]: { [key: string]: number } } = {};

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
      if (nassauResults.payments) {
        allPayments.push(...nassauResults.payments);
      }
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
      
      mockScores.forEach((playerScores, playerIndex) => {
        playerScores.forEach((score, holeIndex) => {
          if (!newHoleScores[holeIndex + 1]) {
            newHoleScores[holeIndex + 1] = {};
          }
          newHoleScores[holeIndex + 1][players[playerIndex].name] = score;
        });
      });
      
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
    setHoleScores(newHoleScores);
  };

  return (
    <Card className="mt-4 bg-white/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Match Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <MatchSetupChat onMatchSetup={handleMatchSetup} />

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
                <NassauResults nassau={matchResult.details.nassau} />
              )}

              {matchResult.details?.skins?.skins?.length > 0 && (
                <SkinsResults 
                  skins={matchResult.details.skins.skins} 
                  holeScores={holeScores}
                />
              )}

              {matchResult.details?.birdies?.birdies?.length > 0 && (
                <BirdieResults birdies={matchResult.details.birdies.birdies} />
              )}

              {matchResult.details?.eagles?.eagles?.length > 0 && (
                <EagleResults eagles={matchResult.details.eagles.eagles} />
              )}

              {matchResult.details.consolidatedPayments && (
                <PaymentSummary payments={matchResult.details.consolidatedPayments} />
              )}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
