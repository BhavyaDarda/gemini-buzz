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
    const { topic } = await req.json()
    const ASTRA_DB_API_ENDPOINT = Deno.env.get('ASTRA_DB_API_ENDPOINT')
    const ASTRA_DB_APPLICATION_TOKEN = Deno.env.get('ASTRA_DB_APPLICATION_TOKEN')
    const ASTRA_DB_KEYSPACE = Deno.env.get('ASTRA_DB_KEYSPACE')

    console.log('Fetching analytics for topic:', topic)

    let posts = []

    // Try to fetch posts related to the topic from Astra DB
    if (ASTRA_DB_API_ENDPOINT && ASTRA_DB_APPLICATION_TOKEN && topic) {
      try {
        const response = await fetch(`${ASTRA_DB_API_ENDPOINT}/api/rest/v2/keyspaces/${ASTRA_DB_KEYSPACE}/posts?where={"topic":"${topic}"}`, {
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

    // Generate sample analytics data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString().split('T')[0],
        impressions: Math.floor(Math.random() * 5000) + 1000,
        engagement: Math.floor(Math.random() * 500) + 50,
        clicks: Math.floor(Math.random() * 200) + 20,
        virality_score: Math.round((Math.random() * 4 + 6) * 10) / 10
      }
    })

    // Performance by subreddit
    const subredditPerformance = [
      { subreddit: 'r/productivity', posts: 12, avg_score: 8.4, total_engagement: 1200 },
      { subreddit: 'r/entrepreneur', posts: 8, avg_score: 7.9, total_engagement: 980 },
      { subreddit: 'r/technology', posts: 15, avg_score: 7.2, total_engagement: 2100 },
      { subreddit: 'r/LifeProTips', posts: 6, avg_score: 8.8, total_engagement: 750 },
      { subreddit: 'r/getmotivated', posts: 10, avg_score: 7.6, total_engagement: 850 }
    ]

    // Content type performance
    const contentTypePerformance = [
      { type: 'text', posts: 25, avg_score: 7.8, engagement_rate: '12.5%' },
      { type: 'image', posts: 18, avg_score: 8.2, engagement_rate: '15.8%' },
      { type: 'video', posts: 8, avg_score: 8.9, engagement_rate: '18.3%' },
      { type: 'link', posts: 5, avg_score: 6.9, engagement_rate: '9.2%' }
    ]

    // Engagement metrics
    const engagementMetrics = {
      total_posts: posts.length || 56,
      total_impressions: 142500,
      total_engagement: 18750,
      avg_virality_score: 7.8,
      best_performing_post: {
        title: topic ? `Best ${topic} post` : 'AI productivity breakthrough',
        score: 9.2,
        engagement: 850
      },
      engagement_rate: '13.2%',
      growth_rate: '+23.5%'
    }

    // ROI/ROA calculations
    const roiMetrics = {
      cost_per_post: 0.02, // Based on API usage
      avg_impressions_per_post: 2540,
      cost_per_impression: 0.000008,
      estimated_value_per_engagement: 0.15,
      roi_percentage: '+1250%',
      total_value_generated: 2812.50
    }

    const result = {
      topic: topic || 'Overall',
      time_series: last30Days,
      subreddit_performance: subredditPerformance,
      content_type_performance: contentTypePerformance,
      engagement_metrics: engagementMetrics,
      roi_metrics: roiMetrics,
      generated_at: new Date().toISOString()
    }

    console.log('Returning analytics for topic:', topic)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Analytics function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})