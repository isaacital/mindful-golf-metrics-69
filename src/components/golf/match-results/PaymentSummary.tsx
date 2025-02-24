
import { motion } from "framer-motion";

interface PaymentSummaryProps {
  payments: Array<{
    from: string;
    payees: Array<{
      to: string;
      amount: number;
      reason: string;
    }>;
  }>;
}

export const PaymentSummary = ({ payments }: PaymentSummaryProps) => {
  return (
    <div className="pt-4">
      <h4 className="text-sm font-medium mb-2">Final Payment Summary</h4>
      <div className="space-y-4">
        {payments.map((payment, index) => (
          <div key={index} className="p-3 bg-white/80 rounded-lg">
            <div className="text-sm font-medium text-red-500 mb-2">
              {payment.from} owes:
            </div>
            <div className="space-y-2 pl-4">
              {payment.payees.map((payee, pIndex) => (
                <div key={pIndex} className="text-sm flex items-center justify-between">
                  <div>
                    <span className="text-green-600 font-medium">{payee.to}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({payee.reason})
                    </span>
                  </div>
                  <div className="font-semibold">${payee.amount}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
