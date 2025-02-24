
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const { messages } = await req.json()
    
    console.log('Received messages:', messages) // Debug log

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
            content: `You are a golf match setup assistant. Help players set up their golf match format and betting structure.
            When users describe their desired match format, analyze their input and convert it into a standardized format that includes:
            - Nassau bets (front 9, back 9, overall match)
            - Skins games
            - Other common golf bets (birdies, eagles)
            
            Always clarify amounts and rules. If any detail is unclear, ask follow-up questions.
            Your responses should be friendly but concise.
            
            When you understand the complete match format, return it in a JSON format like this:
            {
              "type": ["nassau", "skins", "birdies"],
              "amounts": {
                "nassau": 5,
                "skins": 2,
                "birdies": 1
              }
            }
            
            Only return JSON when you're completely confident about the match format. Otherwise, ask clarifying questions.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    })

    const data = await response.json()
    console.log('OpenAI response:', data) // Debug log

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${JSON.stringify(data)}`)
    }

    return new Response(JSON.stringify(data), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    })
  } catch (error) {
    console.error('Error in chat-match-setup:', error) // Debug log
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while processing your request' 
      }), 
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})
