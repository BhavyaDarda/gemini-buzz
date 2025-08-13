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
    const { post_id, subreddit, auto_post_toggle, consent, title, content, session_id } = await req.json()
    const REDDIT_CLIENT_ID = Deno.env.get('REDDIT_CLIENT_ID')
    const REDDIT_CLIENT_SECRET = Deno.env.get('REDDIT_CLIENT_SECRET')
    const REDDIT_REDIRECT_URI = Deno.env.get('REDDIT_REDIRECT_URI')
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
        error: 'Reddit API credentials not configured. Please connect Reddit in Settings.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Fetch token from Astra DB using session_id
    if (!session_id) {
      return new Response(JSON.stringify({ 
        error: 'Missing session identifier. Please connect Reddit in Settings.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let access_token: string | null = null
    let refresh_token: string | null = null

    if (ASTRA_DB_API_ENDPOINT && ASTRA_DB_APPLICATION_TOKEN) {
      try {
        const resp = await fetch(`${ASTRA_DB_API_ENDPOINT}/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/users/${session_id}`, {
          headers: {
            'X-Cassandra-Token': ASTRA_DB_APPLICATION_TOKEN,
            'Content-Type': 'application/json'
          }
        })
        if (resp.ok) {
          const data = await resp.json()
          const token = data?.data?.reddit_oauth_token || data?.reddit_oauth_token
          access_token = token?.access_token || null
          refresh_token = token?.refresh_token || null
        }
      } catch (dbErr) {
        console.error('Failed to fetch Reddit token:', dbErr)
      }
    }

    // Refresh token if needed
    if (!access_token && refresh_token && REDDIT_REDIRECT_URI) {
      const basic = btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`)
      const r = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token })
      })
      const j = await r.json()
      if (r.ok) {
        access_token = j.access_token
      }
    }

    if (!access_token) {
      const oauthUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=${post_id}&redirect_uri=${REDDIT_REDIRECT_URI}&duration=permanent&scope=submit%20identity`
      return new Response(JSON.stringify({
        type: 'oauth_required',
        message: 'Please connect Reddit to enable auto-posting.',
        oauth_url: oauthUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Submit self post to Reddit
    try {
      const submitResp = await fetch('https://oauth.reddit.com/api/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'User-Agent': 'LovableRedditPoster/1.0 by LovableApp',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          kind: 'self',
          sr: subreddit,
          title: title || '',
          text: content || '',
          resubmit: 'true',
          api_type: 'json'
        })
      })
      const submitJson = await submitResp.json()
      if (!submitResp.ok || submitJson?.json?.errors?.length) {
        console.error('Reddit submit error:', submitJson)
        throw new Error('Reddit submission failed')
      }

      const reddit_post_id = submitJson?.json?.data?.id || submitJson?.json?.data?.name || null

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
              reddit_post_id,
              posted_at: new Date().toISOString()
            })
          })
        } catch (dbError) {
          console.error('Database update error:', dbError)
        }
      }

      return new Response(JSON.stringify({
        type: 'posted',
        reddit_post_id,
        message: 'Posted to Reddit successfully.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (e) {
      console.error('Auto-post failure:', e)
      return new Response(JSON.stringify({ error: 'Auto-post failed. Please try manual posting.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    console.error('Post function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})