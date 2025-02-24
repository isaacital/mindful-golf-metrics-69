
import { motion } from "framer-motion";

interface NassauResultsProps {
  nassau: {
    front9: { winner: string; amount: number };
    back9: { winner: string; amount: number };
    total: { winner: string; amount: number };
  };
}

export const NassauResults = ({ nassau }: NassauResultsProps) => {
  return (
    <div className="pt-4 space-y-4">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium">Nassau Results</h4>
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
          Nassau Match
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-white/80 rounded-lg">
          <div className="text-xs text-muted-foreground">Front 9</div>
          <div className="font-medium">{nassau.front9.winner}</div>
          <div className="text-sm font-semibold text-green-600">
            ${nassau.front9.amount}
          </div>
        </div>
        <div className="p-3 bg-white/80 rounded-lg">
          <div className="text-xs text-muted-foreground">Back 9</div>
          <div className="font-medium">{nassau.back9.winner}</div>
          <div className="text-sm font-semibold text-green-600">
            ${nassau.back9.amount}
          </div>
        </div>
        <div className="p-3 bg-white/80 rounded-lg">
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="font-medium">{nassau.total.winner}</div>
          <div className="text-sm font-semibold text-green-600">
            ${nassau.total.amount}
          </div>
        </div>
      </div>
    </div>
  );
};
