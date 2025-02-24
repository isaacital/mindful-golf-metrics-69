
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
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a golf match setup assistant. Parse user input about golf match formats and respond ONLY with JSON in this exact format:
            {
              "type": string[],
              "amounts": {
                "nassau"?: number,
                "skins"?: number,
                "birdies"?: number,
                "eagles"?: number
              },
              "description": string
            }
            
            If you need clarification, respond with normal text. Only return JSON when you fully understand the match format.
            
            Example user input: "Let's do a $5 nassau and $2 skins"
            Example response: 
            {
              "type": ["nassau", "skins"],
              "amounts": {
                "nassau": 5,
                "skins": 2
              },
              "description": "$5 Nassau, $2 Skins per hole"
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
