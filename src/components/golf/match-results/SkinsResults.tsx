
import { motion } from "framer-motion";

interface SkinsResultsProps {
  skins: Array<{
    hole: number;
    winner: string;
    amount: number;
  }>;
  holeScores: { [key: number]: { [key: string]: number } };
}

export const SkinsResults = ({ skins, holeScores }: SkinsResultsProps) => {
  if (!skins?.length) return null;

  return (
    <div className="pt-4 space-y-2">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium">Skins Results</h4>
      </div>
      {skins.map((skin, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-2 bg-white/80 rounded-lg"
        >
          <span className="text-sm">
            Hole {skin.hole} - {skin.winner} ({holeScores[skin.hole]?.[skin.winner]})
          </span>
          <span className="text-sm font-semibold text-green-600">
            ${skin.amount}
          </span>
        </div>
      ))}
    </div>
  );
};
