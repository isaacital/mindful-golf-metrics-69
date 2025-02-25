
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
            
            Rules for different match types:
            - Nassau: Calculate front 9, back 9, and total match separately
            - Skins: Each hole is worth the stake amount, ties carry over
            - Birdies: Player gets paid by all others for scoring under par
            - Eagles: Player gets paid double birdie amount for scoring 2 under par
            - Best Ball: Use lowest score between team members for each hole
            
            Return results in this exact JSON format:
            {
              "type": string[],
              "details": {
                "nassau"?: {
                  "front9": { "winner": string, "amount": number },
                  "back9": { "winner": string, "amount": number },
                  "total": { "winner": string, "amount": number }
                },
                "skins"?: {
                  "skins": Array<{ hole: number, winner: string, amount: number }>,
                  "payments": Array<{ from: string, to: string, amount: number, reason: string }>
                },
                "birdies"?: {
                  "birdies": Array<{ hole: number, player: string, amount: number }>,
                  "payments": Array<{ from: string, to: string, amount: number, reason: string }>
                },
                "eagles"?: {
                  "eagles": Array<{ hole: number, player: string, amount: number }>,
                  "payments": Array<{ from: string, to: string, amount: number, reason: string }>
                }
              },
              "consolidatedPayments": Array<{
                from: string,
                payees: Array<{ to: string, amount: number, reason: string }>
              }>
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
        max_tokens: 1000
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
