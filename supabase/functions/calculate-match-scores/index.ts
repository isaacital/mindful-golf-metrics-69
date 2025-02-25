
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const { match, players, scores, pars } = await req.json()
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a golf scoring assistant that calculates match results based on provided scores and rules.
            
            Return results in this exact JSON format:
            {
              "type": string[],  // Array of game types being played
              "settings": {
                "playType": "stroke" | "match",  // Default to "stroke" if not specified
                "bestBalls": number,  // Number of best balls to count, default to 1
                "handicapHandling": {
                  "type": "none" | "full" | "percentage",
                  "percentage": number  // e.g., 90 for 90% handicap
                }
              },
              "details": {
                "teams": {
                  "A": {
                    "front9": number,
                    "back9": number,
                    "total": number,
                    "scores": number[]  // Array of 18 holes
                  },
                  "B": {
                    "front9": number,
                    "back9": number,
                    "total": number,
                    "scores": number[]  // Array of 18 holes
                  }
                },
                "nassau"?: {
                  "front9": { 
                    "winner": string, 
                    "amount": number,
                    "summary": string  // e.g., "Team A wins front 9 by 2 holes"
                  },
                  "back9": { 
                    "winner": string, 
                    "amount": number,
                    "summary": string
                  },
                  "total": { 
                    "winner": string, 
                    "amount": number,
                    "summary": string
                  }
                },
                "skins"?: {
                  "holes": Array<{
                    "hole": number,
                    "winner": string,
                    "amount": number,
                    "score": number,
                    "carryover": boolean,  // true if this skin included carried over amounts
                    "summary": string  // e.g., "John wins hole 4 with a birdie"
                  }>,
                  "totalAmount": number
                },
                "birdies"?: {
                  "players": Array<{
                    "name": string,
                    "holes": Array<{
                      "hole": number,
                      "score": number,
                      "par": number,
                      "amount": number
                    }>,
                    "totalAmount": number
                  }>
                },
                "eagles"?: {
                  "players": Array<{
                    "name": string,
                    "holes": Array<{
                      "hole": number,
                      "score": number,
                      "par": number,
                      "amount": number
                    }>,
                    "totalAmount": number
                  }>
                },
                "bestBall"?: {
                  "teams": {
                    "A": {
                      "scores": number[],  // Array of 18 best ball scores
                      "total": number
                    },
                    "B": {
                      "scores": number[],
                      "total": number
                    }
                  },
                  "winner": string,
                  "amount": number,
                  "summary": string  // e.g., "Team A wins best ball by 3 strokes"
                }
              },
              "payments": Array<{
                "from": string,
                "to": string,
                "amount": number,
                "reason": string,  // Detailed reason e.g., "Nassau front 9 - Team A wins by 2 holes"
                "gameType": string  // e.g., "nassau", "skins", "birdies", etc.
              }>,
              "summary": {
                "byPlayer": Array<{
                  "name": string,
                  "totalOwed": number,  // Negative if they owe money
                  "totalWon": number,
                  "netAmount": number,
                  "details": Array<{
                    "gameType": string,
                    "amount": number,
                    "description": string
                  }>
                }>,
                "byTeam": {
                  "A": {
                    "totalWon": number,
                    "totalLost": number,
                    "netAmount": number
                  },
                  "B": {
                    "totalWon": number,
                    "totalLost": number,
                    "netAmount": number
                  }
                }
              }
            }`
          },
          {
            role: 'user',
            content: `Calculate results for:
            Match setup: ${JSON.stringify(match)}
            Players: ${JSON.stringify(players)}
            Scores: ${JSON.stringify(scores)}
            Pars: ${JSON.stringify(pars)}`
          }
        ],
        temperature: 0.1, // Low temperature for consistent calculations
        max_tokens: 2000
      }),
    });

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${JSON.stringify(data)}`)
    }

    // Parse the response content as JSON since it's returned as a string
    const results = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in calculate-match-scores:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred while processing your request' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
