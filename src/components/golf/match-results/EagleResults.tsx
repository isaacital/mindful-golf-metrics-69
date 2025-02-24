
import { motion } from "framer-motion";

interface EagleResultsProps {
  eagles: Array<{
    hole: number;
    player: string;
    amount: number;
  }>;
}

export const EagleResults = ({ eagles }: EagleResultsProps) => {
  if (!eagles?.length) return null;

  return (
    <div className="pt-4 space-y-2">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium">Eagle Results</h4>
        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
          Eagle Pot
        </span>
      </div>
      {eagles.map((eagle, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-2 bg-white/80 rounded-lg"
        >
          <span className="text-sm">
            Hole {eagle.hole} - {eagle.player}
          </span>
          <span className="text-sm font-semibold text-green-600">
            ${eagle.amount}
          </span>
        </div>
      ))}
    </div>
  );
};
