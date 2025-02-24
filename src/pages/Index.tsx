
import { motion } from "framer-motion";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CourseSelector } from "@/components/golf/CourseSelector";
import { AddPlayerForm } from "@/components/golf/AddPlayerForm";
import { ScoreCard } from "@/components/golf/ScoreCard";
import { MatchSetup } from "@/components/golf/MatchSetup";
import { PlayerManagement } from "@/components/golf/PlayerManagement";
import { toast } from "sonner";

interface Player {
  id: string;
  name: string;
  handicapIndex: number;
  tee: string;
  team: string;  // Changed from 'A' | 'B' to string
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

  const calculateCourseHandicap = (handicapIndex: number, tee: string) => {
    const selectedTee = selectedCourse?.tees?.find(t => t.color === tee);
    if (!selectedTee) return 0;
    return Math.round(handicapIndex * (selectedTee.slope / 113) + (selectedTee.rating - 72));
  };

  const addPlayer = () => {
    if (newPlayerName && newPlayerHandicap && selectedCourse) {
      const courseHandicap = calculateCourseHandicap(parseFloat(newPlayerHandicap), newPlayerTee);
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName,
        handicapIndex: parseFloat(newPlayerHandicap),
        tee: newPlayerTee,
        team: 'A', // Default team
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

  const updateScore = (playerId: string, holeNumber: number, score: number) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        const newScores = [...player.scores];
        newScores[holeNumber - 1] = score;
        return { ...player, scores: newScores };
      }
      return player;
    }));
  };

  const updateTeam = (playerId: string, team: string) => {
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

  const calculateTeamScores = (players: Player[]): { [team: string]: { gross: number; net: number } } => {
    const scores: { [team: string]: { gross: number; net: number } } = {};
    
    players.forEach(player => {
      if (!scores[player.team]) {
        scores[player.team] = { gross: 0, net: 0 };
      }
      
      const totalScore = player.scores.reduce((sum, score) => sum + (score || 0), 0);
      const netScore = totalScore - player.courseHandicap;
      
      scores[player.team].gross += totalScore;
      scores[player.team].net += netScore;
    });

    return scores;
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
