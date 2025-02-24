
import { motion } from "framer-motion";

interface BirdieResultsProps {
  birdies: Array<{
    hole: number;
    player: string;
    amount: number;
  }>;
}

export const BirdieResults = ({ birdies }: BirdieResultsProps) => {
  if (!birdies?.length) return null;

  return (
    <div className="pt-4 space-y-2">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium">Birdie Results</h4>
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
          Birdie Pot
        </span>
      </div>
      {birdies.map((birdie, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-2 bg-white/80 rounded-lg"
        >
          <span className="text-sm">
            Hole {birdie.hole} - {birdie.player}
          </span>
          <span className="text-sm font-semibold text-green-600">
            ${birdie.amount}
          </span>
        </div>
      ))}
    </div>
  );
};
