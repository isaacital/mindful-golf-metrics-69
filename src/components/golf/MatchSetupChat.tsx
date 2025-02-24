
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MatchSetupChatProps {
  onMatchSetup: (matchInput: string) => void;
}

export const MatchSetupChat = ({ onMatchSetup }: MatchSetupChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-match-setup', {
        body: {
          messages: [
            ...messages,
            { role: 'user', content: userMessage }
          ]
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message);
      }

      if (!data?.choices?.[0]?.message) {
        throw new Error("Invalid response format from AI");
      }

      const assistantMessage = data.choices[0].message;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantMessage.content 
      }]);

      // Check if the response contains valid JSON match setup
      try {
        const jsonMatch = JSON.parse(assistantMessage.content);
        if (jsonMatch.type && jsonMatch.amounts) {
          // Convert the JSON format to match input string
          const parts = [];
          if (jsonMatch.amounts.nassau) {
            parts.push(`$${jsonMatch.amounts.nassau} Nassau`);
          }
          if (jsonMatch.amounts.skins) {
            parts.push(`$${jsonMatch.amounts.skins} skins`);
          }
          if (jsonMatch.amounts.birdies) {
            parts.push(`$${jsonMatch.amounts.birdies} birdies`);
          }
          if (jsonMatch.amounts.eagles) {
            parts.push(`$${jsonMatch.amounts.eagles} eagles`);
          }
          onMatchSetup(parts.join(', '));
        }
      } catch (e) {
        // Not JSON format, continue conversation
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Error: Unable to connect to the AI assistant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 space-y-4">
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg px-4 py-2 bg-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Describe your match format..."
          disabled={isLoading}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading || !input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
