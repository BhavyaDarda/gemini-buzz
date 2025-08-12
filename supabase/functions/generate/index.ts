import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { topic, tone, content_type, subreddit_hint, media_choice } = await req.json()
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    const ASTRA_DB_API_ENDPOINT = Deno.env.get('ASTRA_DB_API_ENDPOINT')
    const ASTRA_DB_APPLICATION_TOKEN = Deno.env.get('ASTRA_DB_APPLICATION_TOKEN')
    const ASTRA_DB_KEYSPACE = Deno.env.get('ASTRA_DB_KEYSPACE')

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured')
    }

    // Generate post with Gemini Pro
    const geminiPrompt = `Create a viral Reddit post about "${topic}".
    
Instructions:
- Target subreddit: ${subreddit_hint || 'general'}
- Tone: ${tone || 'engaging'}
- Content type: ${content_type || 'text'}
- Make it compelling, authentic, and likely to get high engagement
- Include a catchy title and detailed body
- Add strategic hooks and emotional triggers
- Format: Title on first line, then body content

Generate ONLY the post content, no explanations.`

    console.log('Calling Gemini API with prompt:', geminiPrompt.substring(0, 100) + '...')

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: geminiPrompt }]
        }]
      })
    })

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', await geminiResponse.text())
      throw new Error(`Gemini API failed: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Failed to generate content'

    // Parse title and content
    const lines = generatedText.split('\n')
    const title = lines[0].replace(/^#+\s*/, '').trim()
    const content = lines.slice(1).join('\n').trim()

    // Calculate virality score (basic algorithm)
    const viralityScore = Math.min(10, Math.max(1, 
      (title.length > 30 ? 2 : 0) +
      (content.length > 200 ? 2 : 0) +
      (content.includes('?') ? 1 : 0) +
      (content.includes('!') ? 1 : 0) +
      (topic.toLowerCase().includes('trending') ? 2 : 0) +
      Math.random() * 3
    ))

    // Estimate engagement
    const estimatedViews = viralityScore > 7 ? '25k-50k' : viralityScore > 5 ? '10k-25k' : '2k-10k'
    const engagementLevel = viralityScore > 7 ? 'Very High' : viralityScore > 5 ? 'High' : 'Medium'

    // Generate media recommendation if needed
    let mediaRec = null
    if (media_choice === 'image') {
      mediaRec = `Create an infographic about ${topic} with key statistics and visual elements`
    } else if (media_choice === 'video') {
      mediaRec = `Short video demonstrating ${topic} concepts with engaging visuals`
    }

    // Save to Astra DB
    const postId = crypto.randomUUID()
    if (ASTRA_DB_API_ENDPOINT && ASTRA_DB_APPLICATION_TOKEN) {
      try {
        await fetch(`${ASTRA_DB_API_ENDPOINT}/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/posts`, {
          method: 'POST',
          headers: {
            'X-Cassandra-Token': ASTRA_DB_APPLICATION_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: postId,
            title,
            body: content,
            topic,
            tone,
            content_type,
            subreddit_hint,
            virality_score: viralityScore,
            predicted_engagement: estimatedViews,
            media_rec: mediaRec,
            created_at: new Date().toISOString(),
            posted_flag: false
          })
        })
      } catch (dbError) {
        console.error('Astra DB save error:', dbError)
        // Continue without failing the request
      }
    }

    // Log usage
    if (ASTRA_DB_API_ENDPOINT && ASTRA_DB_APPLICATION_TOKEN) {
      try {
        await fetch(`${ASTRA_DB_API_ENDPOINT}/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/usage_logs`, {
          method: 'POST',
          headers: {
            'X-Cassandra-Token': ASTRA_DB_APPLICATION_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: crypto.randomUUID(),
            api_type: 'gemini',
            tokens_used: Math.floor(generatedText.length / 4),
            cost_estimate: 0.02,
            timestamp: new Date().toISOString()
          })
        })
      } catch (logError) {
        console.error('Usage log error:', logError)
      }
    }

    const result = {
      id: postId,
      title,
      content,
      viralityScore: Math.round(viralityScore * 10) / 10,
      estimatedViews,
      engagement: engagementLevel,
      mediaRecommendation: mediaRec,
      tags: ['ai-generated', topic.toLowerCase().replace(/\s+/g, '-')],
      tokenUsage: Math.floor(generatedText.length / 4),
      costEstimate: '$0.02'
    }

    console.log('Generated post result:', result)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Generate function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})