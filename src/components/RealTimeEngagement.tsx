import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Eye, MessageCircle, TrendingUp, Users, Clock, Zap, Loader2 } from "lucide-react";
import { api } from "@/api/client";
import { useTrendsStream } from "@/hooks/useTrendsStream";

interface EngagementMetric {
  timestamp: string;
  views: number;
  comments: number;
  upvotes: number;
  engagement_rate: number;
  velocity: number;
}

interface LivePost {
  id: string;
  title: string;
  subreddit: string;
  created_at: string;
  current_score: number;
  comments: number;
  upvote_ratio: number;
  is_trending: boolean;
}

export const RealTimeEngagement = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '6h' | '24h'>('1h');
  const [liveMetrics, setLiveMetrics] = useState<EngagementMetric[]>([]);
  const [livePosts, setLivePosts] = useState<LivePost[]>([]);
  
  const { events } = useTrendsStream();
  
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["engagement-analytics"],
    queryFn: () => api.analytics({ topic: "overall" }),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: historyData } = useQuery({
    queryKey: ["live-posts"],
    queryFn: api.history,
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  // Simulate real-time metrics generation
  useEffect(() => {
    const generateMetrics = () => {
      const now = new Date();
      const newMetric: EngagementMetric = {
        timestamp: now.toISOString(),
        views: Math.floor(Math.random() * 1000) + 500,
        comments: Math.floor(Math.random() * 50) + 10,
        upvotes: Math.floor(Math.random() * 200) + 50,
        engagement_rate: Math.random() * 15 + 5,
        velocity: Math.random() * 10 + 2
      };
      
      setLiveMetrics(prev => [...prev.slice(-19), newMetric]);
    };

    // Initial metrics
    const initialMetrics = Array.from({ length: 20 }, (_, i) => {
      const timestamp = new Date(Date.now() - (19 - i) * 60000);
      return {
        timestamp: timestamp.toISOString(),
        views: Math.floor(Math.random() * 1000) + 500,
        comments: Math.floor(Math.random() * 50) + 10,
        upvotes: Math.floor(Math.random() * 200) + 50,
        engagement_rate: Math.random() * 15 + 5,
        velocity: Math.random() * 10 + 2
      };
    });
    
    setLiveMetrics(initialMetrics);
    
    const interval = setInterval(generateMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Update live posts based on history data
  useEffect(() => {
    if (historyData?.posts) {
      const recentPosts = historyData.posts.slice(0, 5).map((post: any) => ({
        id: post.id,
        title: post.title,
        subreddit: post.subreddit || 'r/unknown',
        created_at: post.created_at,
        current_score: post.actual_engagement || Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        upvote_ratio: Math.random() * 0.3 + 0.7,
        is_trending: Math.random() > 0.6
      }));
      setLivePosts(recentPosts);
    }
  }, [historyData]);

  const chartData = liveMetrics.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    views: metric.views,
    engagement: metric.engagement_rate,
    velocity: metric.velocity
  }));

  const currentMetrics = liveMetrics[liveMetrics.length - 1];
  const previousMetrics = liveMetrics[liveMetrics.length - 2];
  
  const getChangeIndicator = (current: number, previous: number) => {
    if (!previous) return { change: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return { change: Math.abs(change), isPositive: change >= 0 };
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>Real-Time Engagement</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-success animate-pulse" />
            Real-Time Engagement
          </div>
          <div className="flex gap-2">
            {(['1h', '6h', '24h'] as const).map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className="text-xs"
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </CardTitle>
        <CardDescription>
          Live metrics from your active posts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Live Metrics Dashboard */}
        {currentMetrics && (
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-card/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Views</span>
              </div>
              <div className="text-lg font-bold">{currentMetrics.views.toLocaleString()}</div>
              {previousMetrics && (
                <div className={`text-xs flex items-center justify-center gap-1 ${
                  getChangeIndicator(currentMetrics.views, previousMetrics.views).isPositive 
                    ? 'text-success' : 'text-destructive'
                }`}>
                  <TrendingUp className="h-3 w-3" />
                  {getChangeIndicator(currentMetrics.views, previousMetrics.views).change.toFixed(1)}%
                </div>
              )}
            </div>

            <div className="text-center p-3 bg-card/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageCircle className="h-4 w-4 text-viral" />
                <span className="text-sm font-medium">Comments</span>
              </div>
              <div className="text-lg font-bold">{currentMetrics.comments}</div>
              {previousMetrics && (
                <div className={`text-xs flex items-center justify-center gap-1 ${
                  getChangeIndicator(currentMetrics.comments, previousMetrics.comments).isPositive 
                    ? 'text-success' : 'text-destructive'
                }`}>
                  <TrendingUp className="h-3 w-3" />
                  {getChangeIndicator(currentMetrics.comments, previousMetrics.comments).change.toFixed(1)}%
                </div>
              )}
            </div>

            <div className="text-center p-3 bg-card/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Upvotes</span>
              </div>
              <div className="text-lg font-bold">{currentMetrics.upvotes}</div>
              {previousMetrics && (
                <div className={`text-xs flex items-center justify-center gap-1 ${
                  getChangeIndicator(currentMetrics.upvotes, previousMetrics.upvotes).isPositive 
                    ? 'text-success' : 'text-destructive'
                }`}>
                  <TrendingUp className="h-3 w-3" />
                  {getChangeIndicator(currentMetrics.upvotes, previousMetrics.upvotes).change.toFixed(1)}%
                </div>
              )}
            </div>

            <div className="text-center p-3 bg-card/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">Velocity</span>
              </div>
              <div className="text-lg font-bold">{currentMetrics.velocity.toFixed(1)}x</div>
              {previousMetrics && (
                <div className={`text-xs flex items-center justify-center gap-1 ${
                  getChangeIndicator(currentMetrics.velocity, previousMetrics.velocity).isPositive 
                    ? 'text-success' : 'text-destructive'
                }`}>
                  <TrendingUp className="h-3 w-3" />
                  {getChangeIndicator(currentMetrics.velocity, previousMetrics.velocity).change.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        )}

        {/* Real-Time Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                className="text-xs"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                className="text-xs"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-elegant)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke="hsl(var(--viral))" 
                fill="hsl(var(--viral))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Live Posts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Active Posts</h4>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Live
            </Badge>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {livePosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{post.title}</span>
                    {post.is_trending && (
                      <Badge variant="secondary" className="text-xs bg-viral/10 text-viral">
                        🔥 Trending
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.subreddit}</span>
                    <span>{post.current_score} upvotes</span>
                    <span>{post.comments} comments</span>
                    <span>{(post.upvote_ratio * 100).toFixed(0)}% upvoted</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-success">
                    {post.current_score}
                  </div>
                  <Progress 
                    value={post.upvote_ratio * 100} 
                    className="w-16 h-1 mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};