
import { motion } from "framer-motion";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CourseSelector } from "@/components/golf/CourseSelector";
import { AddPlayerForm } from "@/components/golf/AddPlayerForm";
import { ScoreCard } from "@/components/golf/ScoreCard";
import { MatchSetup } from "@/components/golf/MatchSetup";
import { PlayerManagement } from "@/components/golf/PlayerManagement";
import { TeamSelector } from "@/components/golf/TeamSelector";
import { toast } from "sonner";
import { Player } from "@/types/golf";
import { calculateCourseHandicap, calculateTeamScores } from "@/utils/scoreCalculations";

const samplePlayers: Player[] = [
  {
    id: "1",
    name: "Tom Smith",
    handicapIndex: 2.4,
    tee: "Blue",
    team: "A",
    courseHandicap: 3,
    scores: [6, 7, 6, 8, 7, 6, 7, 6, 7, 6, 7, 6, 7, 6, 7, 6, 7, 6], // 88
  },
  {
    id: "2",
    name: "Mike Johnson",
    handicapIndex: 12.1,
    tee: "White",
    team: "A",
    courseHandicap: 13,
    scores: [7, 8, 7, 6, 7, 8, 7, 6, 7, 7, 6, 8, 7, 7, 6, 8, 7, 7], // 91
  },
  {
    id: "3",
    name: "Sarah Williams",
    handicapIndex: 8.7,
    tee: "Red",
    team: "B",
    courseHandicap: 10,
    scores: [5, 4, 4, 5, 4, 5, 4, 4, 5, 4, 5, 4, 5, 4, 4, 5, 4, 4], // 79 (good player)
  },
  {
    id: "4",
    name: "David Brown",
    handicapIndex: 15.3,
    tee: "White",
    team: "B",
    courseHandicap: 17,
    scores: [6, 5, 6, 5, 6, 5, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 5], // 98 (bogey golfer)
  },
  {
    id: "5",
    name: "Jack Wilson",
    handicapIndex: 5.2,
    tee: "Blue",
    team: "C",
    courseHandicap: 6,
    scores: [4, 4, 3, 5, 4, 4, 3, 4, 4, 3, 4, 4, 5, 4, 3, 4, 4, 4], // 72 (very good player)
  },
  {
    id: "6",
    name: "Lisa Anderson",
    handicapIndex: 18.4,
    tee: "Red",
    team: "C",
    courseHandicap: 20,
    scores: [6, 7, 6, 5, 6, 7, 5, 6, 6, 6, 5, 7, 6, 6, 5, 6, 6, 5], // 106 (higher handicap)
  },
  {
    id: "7",
    name: "Bob Martinez",
    handicapIndex: 6.8,
    tee: "Blue",
    team: "D",
    courseHandicap: 8,
    scores: [4, 5, 4, 4, 3, 5, 4, 4, 4, 4, 4, 5, 4, 4, 3, 5, 4, 4], // 74 (good player)
  },
  {
    id: "8",
    name: "Emma Davis",
    handicapIndex: 14.2,
    tee: "Red",
    team: "D",
    courseHandicap: 16,
    scores: [5, 6, 5, 5, 6, 5, 5, 6, 5, 5, 6, 5, 5, 6, 5, 5, 6, 5], // 96 (average-bogey golfer)
  }
];

const Index = () => {
  const [players, setPlayers] = useState<Player[]>(samplePlayers);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerHandicap, setNewPlayerHandicap] = useState("");
  const [newPlayerTee, setNewPlayerTee] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState(2);

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
      const courseHandicap = calculateCourseHandicap(
        parseFloat(newPlayerHandicap),
        newPlayerTee,
        selectedCourse
      );
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
        const courseHandicap = calculateCourseHandicap(player.handicapIndex, tee, selectedCourse);
        return { ...player, tee, courseHandicap };
      }
      return player;
    }));
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

              <TeamSelector 
                numberOfTeams={numberOfTeams}
                onNumberOfTeamsChange={setNumberOfTeams}
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
