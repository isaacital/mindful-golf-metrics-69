
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
