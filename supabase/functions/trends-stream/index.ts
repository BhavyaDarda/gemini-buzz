import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'no-cache'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      // Helper to send event
      const send = (data: unknown) => {
        const payload = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(payload))
      }

      // Initial hello
      send({ type: 'hello', ts: Date.now() })

      // Periodic trend ticks
      const interval = setInterval(() => {
        const topics = ['AI productivity tools', 'Remote work tips', 'Crypto market analysis', 'Healthy meal prep', 'Gaming setup ideas']
        const topic = topics[Math.floor(Math.random() * topics.length)]
        send({
          type: 'trend_update',
          ts: Date.now(),
          trend: {
            id: crypto.randomUUID(),
            topic,
            score: Math.round((6 + Math.random() * 4) * 10) / 10,
            impressions: 15000 + Math.floor(Math.random() * 30000),
            engagement: ['Low', 'Medium', 'High', 'Very High'][Math.floor(Math.random() * 4)],
            growth_rate: `${(Math.random() * 20 - 5).toFixed(1)}%`
          }
        })
      }, 5000)

      // Keep alive
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(': keep-alive\n\n'))
      }, 15000)

      // Cleanup on cancel
      const cancel = () => {
        clearInterval(interval)
        clearInterval(keepAlive)
        controller.close()
      }

      // Close after 5 minutes to prevent leaks
      const timeout = setTimeout(cancel, 5 * 60 * 1000)

      // Attach to request signal
      req.signal.addEventListener('abort', () => {
        clearTimeout(timeout)
        cancel()
      })
    }
  })

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive'
    }
  })
})
