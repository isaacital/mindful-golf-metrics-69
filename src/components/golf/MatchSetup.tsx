
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MatchSetupChat } from "./MatchSetupChat";
import { NassauResults } from "./match-results/NassauResults";
import { SkinsResults } from "./match-results/SkinsResults";
import { BirdieResults } from "./match-results/BirdieResults";
import { EagleResults } from "./match-results/EagleResults";
import { PaymentSummary } from "./match-results/PaymentSummary";
import { MatchConfiguration } from "./match-results/MatchConfiguration";
import { handleMatchSetup } from "./utils/matchSetupHandler";
import { MatchResult } from "@/utils/match/types";
import { TeamScores, Player } from "@/types/golf";

interface MatchSetupProps {
  teamScores: TeamScores;
  players: Player[];  // Updated from { name: string; team: string }[] to Player[]
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

  const onMatchSetup = (result: MatchResult) => {
    const { details, holeScores: newHoleScores } = handleMatchSetup(
      result,
      teamScores,
      players,
      consolidatePayments
    );
    setHoleScores(newHoleScores);
    setMatchResult({ ...result, details });
  };

  return (
    <Card className="mt-4 bg-white/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Match Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <MatchSetupChat onMatchSetup={onMatchSetup} />

          {matchResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 divide-y divide-gray-100"
            >
              <MatchConfiguration matchResult={matchResult} />

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

              {matchResult.details?.consolidatedPayments && (
                <PaymentSummary payments={matchResult.details.consolidatedPayments} />
              )}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
