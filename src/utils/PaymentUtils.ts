
import { Payment, ConsolidatedPayment } from "@/types/match";

export const consolidatePayments = (payments: Payment[]): ConsolidatedPayment[] => {
  const netAmounts = new Map<string, number>();
  
  payments.forEach(payment => {
    netAmounts.set(payment.from, (netAmounts.get(payment.from) || 0) - payment.amount);
    netAmounts.set(payment.to, (netAmounts.get(payment.to) || 0) + payment.amount);
  });

  const balances = Array.from(netAmounts.entries()).map(([player, amount]) => ({ player, amount }));
  const creditors = balances.filter(b => b.amount > 0).sort((a, b) => b.amount - a.amount);
  const debtors = balances.filter(b => b.amount < 0).sort((a, b) => a.amount - b.amount);

  const optimizedPayments: ConsolidatedPayment[] = [];
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
        amount: amount,
        reason: ''
      });
    } else {
      optimizedPayments.push({
        from: debtor.player,
        payees: [{
          to: creditor.player,
          amount: amount,
          reason: ''
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
