import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const params = url.searchParams

  try {
    const REDDIT_CLIENT_ID = Deno.env.get('REDDIT_CLIENT_ID')
    const REDDIT_CLIENT_SECRET = Deno.env.get('REDDIT_CLIENT_SECRET')
    const REDDIT_REDIRECT_URI = Deno.env.get('REDDIT_REDIRECT_URI')

    const ASTRA_DB_API_ENDPOINT = Deno.env.get('ASTRA_DB_API_ENDPOINT')
    const ASTRA_DB_APPLICATION_TOKEN = Deno.env.get('ASTRA_DB_APPLICATION_TOKEN')
    const ASTRA_DB_KEYSPACE = Deno.env.get('ASTRA_DB_KEYSPACE')

    if (req.method === 'POST') {
      const { action, session_id } = await req.json()

      if (action === 'start') {
        if (!REDDIT_CLIENT_ID || !REDDIT_REDIRECT_URI) {
          return new Response(JSON.stringify({ error: 'Reddit credentials not configured' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        const sid = session_id || crypto.randomUUID()
        const scope = encodeURIComponent('submit identity')
        const oauthUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=${sid}&redirect_uri=${encodeURIComponent(REDDIT_REDIRECT_URI)}&duration=permanent&scope=${scope}`
        return new Response(JSON.stringify({ url: oauthUrl, session_id: sid }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (action === 'status') {
        if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_APPLICATION_TOKEN || !session_id) {
          return new Response(JSON.stringify({ connected: false }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        try {
          const resp = await fetch(`${ASTRA_DB_API_ENDPOINT}/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/users/${session_id}`, {
            headers: {
              'X-Cassandra-Token': ASTRA_DB_APPLICATION_TOKEN,
              'Content-Type': 'application/json'
            }
          })
          if (!resp.ok) {
            return new Response(JSON.stringify({ connected: false }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }
          const data = await resp.json()
          const token = data?.data?.reddit_oauth_token || data?.reddit_oauth_token
          return new Response(JSON.stringify({ connected: !!token }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } catch (e) {
          console.error('Status check error:', e)
          return new Response(JSON.stringify({ connected: false }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      }

      return new Response(JSON.stringify({ error: 'Unknown action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // OAuth callback (GET)
    if (req.method === 'GET') {
      const code = params.get('code')
      const state = params.get('state') // session_id

      if (!code || !state) {
        return new Response('Missing code or state', { status: 400, headers: corsHeaders })
      }

      if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET || !REDDIT_REDIRECT_URI) {
        return new Response('Reddit credentials not configured', { status: 500, headers: corsHeaders })
      }

      // Exchange code for tokens
      const basic = btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`)
      const tokenResp = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDDIT_REDIRECT_URI!
        })
      })

      const tokenJson = await tokenResp.json()
      if (!tokenResp.ok) {
        console.error('Reddit token exchange failed:', tokenJson)
        return new Response('OAuth failed. Please close this window and try again.', { status: 500, headers: corsHeaders })
      }

      // Store in Astra DB (upsert by session_id)
      if (ASTRA_DB_API_ENDPOINT && ASTRA_DB_APPLICATION_TOKEN) {
        try {
          const payload: any = {
            id: state,
            reddit_oauth_token: tokenJson,
            created_at: new Date().toISOString()
          }

          // Try PUT to upsert
          await fetch(`${ASTRA_DB_API_ENDPOINT}/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/users/${state}`, {
            method: 'PUT',
            headers: {
              'X-Cassandra-Token': ASTRA_DB_APPLICATION_TOKEN,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
        } catch (e) {
          console.error('Astra DB store token error:', e)
        }
      }

      const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Reddit Connected</title></head><body style="font-family: ui-sans-serif, system-ui; padding: 24px; text-align: center;">
        <h3>Reddit connected successfully!</h3>
        <p>You can close this window and return to the app.</p>
        <script>setTimeout(() => window.close(), 1200)</script>
      </body></html>`

      return new Response(html, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      })
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  } catch (error) {
    console.error('reddit-auth function error:', error)
    return new Response(JSON.stringify({ error: (error as any).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})