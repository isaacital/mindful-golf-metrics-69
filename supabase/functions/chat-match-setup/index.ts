
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

    const { messages } = await req.json()
    
    console.log('Received messages:', messages)

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
            content: `You are a golf match setup assistant. Parse user input about golf match formats and respond with JSON in this exact format:
            {
              "type": string[],
              "amounts": {
                "nassau"?: number,
                "skins"?: number,
                "birdies"?: number,
                "eagles"?: number,
                "bestBall"?: number,
                "press"?: number
              },
              "settings": {
                "automaticPress"?: boolean,
                "pressStartHole"?: number,
                "pressAmount"?: number,
                "teamFormat"?: "individual" | "bestBall" | "alternate" | "scramble",
                "handicaps"?: "full" | "threequarter" | "half" | "none"
              },
              "description": string
            }
            
            Handle various golf betting formats including:
            - Nassau bets with front 9, back 9, and total
            - Automatic and manual presses
            - Best ball team formats
            - Skins games
            - Birdie and eagle bonuses
            - Different handicap applications
            
            If you need clarification about any aspect, ask follow-up questions in plain text.
            Only return JSON when you fully understand the complete match format.
            
            Example responses:
            For "Let's play a $5 Nassau with automatic 2-down presses":
            {
              "type": ["nassau", "press"],
              "amounts": {
                "nassau": 5,
                "press": 5
              },
              "settings": {
                "automaticPress": true,
                "pressStartHole": 2,
                "pressAmount": 5
              },
              "description": "$5 Nassau with automatic 2-down presses"
            }
            
            For "2 man best ball, $10 per team, handicapped":
            {
              "type": ["best-ball"],
              "amounts": {
                "bestBall": 10
              },
              "settings": {
                "teamFormat": "bestBall",
                "handicaps": "full"
              },
              "description": "$10 Best Ball match with full handicaps"
            }`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    })

    const data = await response.json()
    console.log('OpenAI response:', data)

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${JSON.stringify(data)}`)
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in chat-match-setup:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred while processing your request' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
