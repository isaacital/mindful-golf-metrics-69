
import { motion } from "framer-motion";

interface MatchResultDisplayProps {
  matchResult: any;
}

export const MatchResultDisplay = ({ matchResult }: MatchResultDisplayProps) => {
  if (!matchResult) return null;

  return (
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
  );
};
