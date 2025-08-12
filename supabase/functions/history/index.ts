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
    const ASTRA_DB_API_ENDPOINT = Deno.env.get('ASTRA_DB_API_ENDPOINT')
    const ASTRA_DB_APPLICATION_TOKEN = Deno.env.get('ASTRA_DB_APPLICATION_TOKEN')
    const ASTRA_DB_KEYSPACE = Deno.env.get('ASTRA_DB_KEYSPACE')

    console.log('Fetching post history')

    let posts = []

    // Try to fetch from Astra DB
    if (ASTRA_DB_API_ENDPOINT && ASTRA_DB_APPLICATION_TOKEN) {
      try {
        const response = await fetch(`${ASTRA_DB_API_ENDPOINT}/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/posts`, {
          headers: {
            'X-Cassandra-Token': ASTRA_DB_APPLICATION_TOKEN,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          posts = data.data || []
        }
      } catch (dbError) {
        console.error('Database fetch error:', dbError)
      }
    }

    // If no data from DB, generate sample history
    if (posts.length === 0) {
      const samplePosts = [
        {
          id: crypto.randomUUID(),
          title: '🚀 AI Productivity: The Ultimate Guide That Changed Everything',
          topic: 'productivity',
          content: 'I never thought AI could be this game-changing until I discovered...',
          virality_score: 8.7,
          predicted_engagement: '15k-25k',
          actual_engagement: 18200,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          posted_flag: true,
          subreddit: 'r/productivity',
          performance: 'excellent'
        },
        {
          id: crypto.randomUUID(),
          title: 'Remote Work Setup That Tripled My Output',
          topic: 'remote work',
          content: 'After 2 years of trial and error, I finally found the perfect setup...',
          virality_score: 7.9,
          predicted_engagement: '10k-20k',
          actual_engagement: 12500,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          posted_flag: true,
          subreddit: 'r/remotework',
          performance: 'good'
        },
        {
          id: crypto.randomUUID(),
          title: 'Crypto Trading Bot Results After 6 Months',
          topic: 'crypto',
          content: 'Built my own trading bot and here are the real results...',
          virality_score: 8.2,
          predicted_engagement: '20k-35k',
          actual_engagement: 28000,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          posted_flag: true,
          subreddit: 'r/cryptocurrency',
          performance: 'excellent'
        },
        {
          id: crypto.randomUUID(),
          title: 'Learning to Code at 35: My Journey',
          topic: 'programming',
          content: 'They said I was too old to start coding. Here\'s what happened...',
          virality_score: 7.4,
          predicted_engagement: '8k-15k',
          actual_engagement: 9200,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          posted_flag: false,
          subreddit: 'r/learnprogramming',
          performance: 'average'
        },
        {
          id: crypto.randomUUID(),
          title: 'Home Gym Setup Under $500',
          topic: 'fitness',
          content: 'No more gym memberships. Here\'s my complete home setup...',
          virality_score: 6.8,
          predicted_engagement: '5k-12k',
          actual_engagement: 7800,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          posted_flag: true,
          subreddit: 'r/homegym',
          performance: 'good'
        }
      ]

      posts = samplePosts
    }

    // Sort by creation date descending
    posts.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

    // Calculate summary stats
    const totalPosts = posts.length
    const postedCount = posts.filter(p => p.posted_flag).length
    const avgScore = posts.length > 0 ? posts.reduce((sum, p) => sum + (p.virality_score || 0), 0) / posts.length : 0
    const totalEngagement = posts.reduce((sum, p) => sum + (p.actual_engagement || 0), 0)

    const result = {
      posts,
      summary: {
        total_posts: totalPosts,
        posted_count: postedCount,
        draft_count: totalPosts - postedCount,
        avg_virality_score: Math.round(avgScore * 10) / 10,
        total_engagement: totalEngagement,
        success_rate: totalPosts > 0 ? Math.round((postedCount / totalPosts) * 100) : 0
      },
      last_updated: new Date().toISOString()
    }

    console.log('Returning history:', totalPosts, 'posts')

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('History function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})