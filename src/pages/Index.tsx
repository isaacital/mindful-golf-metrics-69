
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Golf, UserCircle, Timer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Golf,
    title: "Course Management",
    description: "Add and manage golf courses with detailed hole information",
  },
  {
    icon: UserCircle,
    title: "Player Profiles",
    description: "Track handicaps and maintain player statistics",
  },
  {
    icon: Timer,
    title: "Live Scoring",
    description: "Record scores in real-time as you play",
  },
  {
    icon: Trophy,
    title: "Performance Analytics",
    description: "View detailed game statistics and improvements",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary inline-block rounded-full mb-4">
          Welcome to Mindful Golf
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Elevate Your Golf Game
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Track your scores, analyze your performance, and improve your game with our
          intelligent golf scoring system.
        </p>
        <Button
          size="lg"
          className="rounded-full px-8 transition-all hover:scale-105"
        >
          Start Scoring
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16"
      >
        {features.map((feature, index) => (
          <Card
            key={index}
            className="group hover:shadow-lg transition-all duration-300 border border-border/50"
          >
            <CardHeader>
              <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
};

export default Index;
