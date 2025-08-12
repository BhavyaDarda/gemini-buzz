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
    const { post_id, subreddit, auto_post_toggle, consent, title, content } = await req.json()
    const REDDIT_CLIENT_ID = Deno.env.get('REDDIT_CLIENT_ID')
    const REDDIT_CLIENT_SECRET = Deno.env.get('REDDIT_CLIENT_SECRET')
    const ASTRA_DB_API_ENDPOINT = Deno.env.get('ASTRA_DB_API_ENDPOINT')
    const ASTRA_DB_APPLICATION_TOKEN = Deno.env.get('ASTRA_DB_APPLICATION_TOKEN')
    const ASTRA_DB_KEYSPACE = Deno.env.get('ASTRA_DB_KEYSPACE')

    console.log('Post request:', { post_id, subreddit, auto_post_toggle, consent: !!consent })

    if (auto_post_toggle && !consent) {
      return new Response(JSON.stringify({ 
        error: 'Consent required for auto-posting' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!auto_post_toggle) {
      // Manual posting - return formatted content for copy/paste
      const redditFormat = `**${title}**\n\n${content}\n\n---\n*Generated with AI*`
      
      return new Response(JSON.stringify({
        type: 'manual',
        formatted_content: redditFormat,
        instructions: `Copy the content above and manually post to r/${subreddit}`,
        subreddit_url: `https://reddit.com/r/${subreddit}/submit?selftext=true&title=${encodeURIComponent(title)}&text=${encodeURIComponent(content)}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Auto-posting flow
    if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
      return new Response(JSON.stringify({ 
        error: 'Reddit API credentials not configured. Please use manual posting.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // For now, return OAuth setup instructions since full OAuth flow requires user interaction
    const oauthUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=${post_id}&redirect_uri=${Deno.env.get('REDDIT_REDIRECT_URI')}&duration=temporary&scope=submit`

    // Update post status in database
    if (ASTRA_DB_API_ENDPOINT && ASTRA_DB_APPLICATION_TOKEN) {
      try {
        await fetch(`${ASTRA_DB_API_ENDPOINT}/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/posts/${post_id}`, {
          method: 'PUT',
          headers: {
            'X-Cassandra-Token': ASTRA_DB_APPLICATION_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            posted_flag: true,
            subreddit,
            posted_at: new Date().toISOString()
          })
        })
      } catch (dbError) {
        console.error('Database update error:', dbError)
      }
    }

    return new Response(JSON.stringify({
      type: 'oauth_required',
      message: 'Reddit OAuth integration coming soon. For now, use manual posting.',
      oauth_url: oauthUrl,
      manual_option: {
        formatted_content: `**${title}**\n\n${content}\n\n---\n*Generated with AI*`,
        subreddit_url: `https://reddit.com/r/${subreddit}/submit?selftext=true&title=${encodeURIComponent(title)}&text=${encodeURIComponent(content)}`
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Post function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})