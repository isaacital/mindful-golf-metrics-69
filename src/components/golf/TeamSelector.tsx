
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeamSelectorProps {
  numberOfTeams: number;
  onNumberOfTeamsChange: (teams: number) => void;
}

export const TeamSelector = ({ numberOfTeams, onNumberOfTeamsChange }: TeamSelectorProps) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="font-medium">Number of Teams:</span>
      <Select 
        value={numberOfTeams.toString()} 
        onValueChange={(value) => onNumberOfTeamsChange(parseInt(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select number of teams" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 9 }, (_, i) => i + 2).map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num} Teams
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
