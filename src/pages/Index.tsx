import { motion } from "framer-motion";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CourseSelector } from "@/components/golf/CourseSelector";
import { AddPlayerForm } from "@/components/golf/AddPlayerForm";
import { ScoreCard } from "@/components/golf/ScoreCard";
import { MatchSetup } from "@/components/golf/MatchSetup";
import { PlayerManagement } from "@/components/golf/PlayerManagement";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Player {
  id: string;
  name: string;
  handicapIndex: number;
  tee: string;
  team: "A" | "B";
  courseHandicap: number;
  scores: (number | null)[];
}

const samplePlayers: Player[] = [
  {
    id: "1",
    name: "John Smith",
    handicapIndex: 8.4,
    tee: "Blue",
    team: 'A',
    courseHandicap: 10,
    scores: [4, 5, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 5, 4, 3, 4, 5, 4],
  },
  {
    id: "2",
    name: "Mike Johnson",
    handicapIndex: 12.1,
    tee: "White",
    team: 'A',
    courseHandicap: 14,
    scores: [5, 6, 5, 4, 5, 6, 5, 5, 4, 6, 5, 5, 6, 5, 4, 5, 6, 5],
  },
  {
    id: "3",
    name: "Sarah Williams",
    handicapIndex: 15.7,
    tee: "Red",
    team: 'B',
    courseHandicap: 17,
    scores: [6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5],
  },
  {
    id: "4",
    name: "David Brown",
    handicapIndex: 10.3,
    tee: "White",
    team: 'B',
    courseHandicap: 12,
    scores: [5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4],
  },
];

const Index = () => {
  const [players, setPlayers] = useState<Player[]>(samplePlayers);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerHandicap, setNewPlayerHandicap] = useState("");
  const [newPlayerTee, setNewPlayerTee] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState(2);

  const calculateCourseHandicap = (handicapIndex: number, tee: string) => {
    const selectedTee = selectedCourse?.tees?.find(t => t.color === tee);
    if (!selectedTee) return 0;
    return Math.round(handicapIndex * (selectedTee.slope / 113) + (selectedTee.rating - 72));
  };

  const updateScore = (playerId: string, holeNumber: number, score: number) => {
    setPlayers(currentPlayers => 
      currentPlayers.map(player => {
        if (player.id === playerId) {
          const newScores = [...player.scores];
          newScores[holeNumber - 1] = score;
          return { ...player, scores: newScores };
        }
        return player;
      })
    );
  };

  const addPlayer = () => {
    if (newPlayerName && newPlayerHandicap && selectedCourse) {
      const courseHandicap = calculateCourseHandicap(parseFloat(newPlayerHandicap), newPlayerTee);
      const teamIndex = players.length % 2;
      const teamLetter = teamIndex === 0 ? "A" : "B";
      
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName,
        handicapIndex: parseFloat(newPlayerHandicap),
        tee: newPlayerTee,
        team: teamLetter,
        courseHandicap,
        scores: Array(18).fill(null),
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
      setNewPlayerHandicap("");
      toast.success(`${newPlayerName} added to the match`);
    }
  };

  const removePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      setPlayers(players.filter(p => p.id !== playerId));
      toast.success(`${player.name} removed from the match`);
    }
  };

  const updateTeam = (playerId: string, team: "A" | "B") => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        return { ...player, team };
      }
      return player;
    }));
  };

  const updatePlayerTee = (playerId: string, tee: string) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        const courseHandicap = calculateCourseHandicap(player.handicapIndex, tee);
        return { ...player, tee, courseHandicap };
      }
      return player;
    }));
  };

  const calculateTeamScores = (players: Player[]) => {
    return {
      A: {
        gross: players.filter(p => p.team === "A")
          .reduce((sum, p) => sum + p.scores.reduce((s, score) => s + (score || 0), 0), 0),
        net: players.filter(p => p.team === "A")
          .reduce((sum, p) => sum + (p.scores.reduce((s, score) => s + (score || 0), 0) - p.courseHandicap), 0)
      },
      B: {
        gross: players.filter(p => p.team === "B")
          .reduce((sum, p) => sum + p.scores.reduce((s, score) => s + (score || 0), 0), 0),
        net: players.filter(p => p.team === "B")
          .reduce((sum, p) => sum + (p.scores.reduce((s, score) => s + (score || 0), 0) - p.courseHandicap), 0)
      }
    };
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen p-4 md:p-6 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <PlayerManagement />
          
          <CourseSelector
            courses={[]}
            selectedCourse={selectedCourse}
            onCourseChange={setSelectedCourse}
          />

          {selectedCourse && (
            <>
              <AddPlayerForm
                tees={selectedCourse.tees}
                newPlayerName={newPlayerName}
                newPlayerHandicap={newPlayerHandicap}
                newPlayerTee={newPlayerTee || (selectedCourse.tees[0]?.color ?? '')}
                onNameChange={setNewPlayerName}
                onHandicapChange={setNewPlayerHandicap}
                onTeeChange={setNewPlayerTee}
                onAddPlayer={addPlayer}
              />

              <div className="flex items-center gap-4 mb-4">
                <span className="font-medium">Number of Teams:</span>
                <Select 
                  value={numberOfTeams.toString()} 
                  onValueChange={(value) => setNumberOfTeams(parseInt(value))}
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

              <div className="overflow-auto">
                <div className="min-w-[1200px]">
                  <ScoreCard
                    players={players}
                    holes={selectedCourse.holes}
                    onUpdateScore={updateScore}
                    onUpdateTeam={updateTeam}
                    onUpdateTee={updatePlayerTee}
                    onRemovePlayer={removePlayer}
                    tees={selectedCourse.tees}
                    numberOfTeams={numberOfTeams}
                  />
                </div>
              </div>

              <MatchSetup 
                teamScores={calculateTeamScores(players)}
                players={players.map(p => ({ name: p.name, team: p.team }))}
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
