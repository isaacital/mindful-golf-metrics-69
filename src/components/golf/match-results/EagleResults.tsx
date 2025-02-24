
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
      <h4 className="text-sm font-medium mb-2">Eagle Results</h4>
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
