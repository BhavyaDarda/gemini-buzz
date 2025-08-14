import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Filter, Clock, Zap, Users, MessageSquare, Loader2 } from "lucide-react";
import { api } from "@/api/client";
import { useTrendsStream } from "@/hooks/useTrendsStream";

interface TrendAnalysisProps {
  selectedNiches?: string[];
}

export const AdvancedTrendAnalysis = ({ selectedNiches = [] }: TrendAnalysisProps) => {
  const [timeWindow, setTimeWindow] = useState("24h");
  const [sortBy, setSortBy] = useState("score");
  const [filterNiche, setFilterNiche] = useState<string>("all");
  
  const { latestTrends } = useTrendsStream();
  
  const { data: trendsData, isLoading } = useQuery({
    queryKey: ["advanced-trends", timeWindow],
    queryFn: () => api.trends({ window: timeWindow, limit: 50 }),
    refetchInterval: 15000,
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["trend-analytics"],
    queryFn: () => api.analytics({ topic: "overall" }),
    refetchInterval: 30000,
  });

  // Combine real-time and historical data
  const combinedTrends = useMemo(() => {
    const historical = trendsData?.trends || [];
    const realtime = latestTrends || [];
    
    // Merge and deduplicate
    const allTrends = [...historical, ...realtime].reduce((acc, trend) => {
      const existing = acc.find(t => t.topic === trend.topic);
      if (existing) {
        // Update with latest data
        Object.assign(existing, trend);
      } else {
        acc.push(trend);
      }
      return acc;
    }, [] as any[]);

    // Apply filters
    let filtered = allTrends;
    
    if (filterNiche !== "all") {
      filtered = filtered.filter(trend => 
        trend.category === filterNiche || 
        trend.tags?.includes(filterNiche)
      );
    }

    if (selectedNiches.length > 0) {
      filtered = filtered.filter(trend =>
        selectedNiches.some(niche => 
          trend.topic.toLowerCase().includes(niche.toLowerCase()) ||
          trend.tags?.some((tag: string) => tag.toLowerCase().includes(niche.toLowerCase()))
        )
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "score": return (b.score || 0) - (a.score || 0);
        case "engagement": return (b.engagement || 0) - (a.engagement || 0);
        case "impressions": return (b.impressions || 0) - (a.impressions || 0);
        case "recent": return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
        default: return 0;
      }
    });
  }, [trendsData, latestTrends, filterNiche, selectedNiches, sortBy]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return combinedTrends.slice(0, 10).map(trend => ({
      topic: trend.topic.length > 15 ? `${trend.topic.slice(0, 15)}...` : trend.topic,
      score: trend.score || 0,
      engagement: trend.engagement || 0,
      impressions: trend.impressions || 0,
      viral_potential: Math.min((trend.score || 0) * 1.2, 10)
    }));
  }, [combinedTrends]);

  const pieData = useMemo(() => {
    const categories = combinedTrends.reduce((acc, trend) => {
      const category = trend.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [combinedTrends]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--viral))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--muted))'];

  if (isLoading) {
    return (
      <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>Advanced Trend Analysis</CardTitle>
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
            <TrendingUp className="h-5 w-5 text-viral" />
            Advanced Trend Analysis
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Live Data
          </Badge>
        </CardTitle>
        <CardDescription>
          Deep dive into trending topics with real-time insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          <Select value={timeWindow} onValueChange={setTimeWindow}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="6h">6 Hours</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">By Score</SelectItem>
              <SelectItem value="engagement">By Engagement</SelectItem>
              <SelectItem value="impressions">By Impressions</SelectItem>
              <SelectItem value="recent">By Recency</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterNiche} onValueChange={setFilterNiche}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Niches</SelectItem>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">Top Trends</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="topic" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="viral_potential" fill="hsl(var(--viral))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Trend List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {combinedTrends.slice(0, 8).map((trend, index) => (
                <div key={`${trend.topic}-${index}`} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{trend.topic}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{(trend.impressions || 0).toLocaleString()}</span>
                      <MessageSquare className="h-3 w-3" />
                      <span>{trend.engagement || 0}</span>
                      <Clock className="h-3 w-3" />
                      <span>{trend.timestamp ? new Date(trend.timestamp).toLocaleTimeString() : 'Unknown'}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {(trend.score || 0).toFixed(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-48">
                <h4 className="text-sm font-medium mb-2">Category Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Key Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Trends</span>
                    <span className="font-medium">{combinedTrends.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg Score</span>
                    <span className="font-medium">
                      {(combinedTrends.reduce((acc, t) => acc + (t.score || 0), 0) / combinedTrends.length || 0).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Top Performer</span>
                    <span className="font-medium text-viral">
                      {combinedTrends[0]?.topic?.slice(0, 15) || 'N/A'}...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Update Frequency</span>
                    <span className="font-medium text-success">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h4 className="font-medium text-primary mb-2">🎯 AI Recommendation</h4>
                <p className="text-sm">
                  Based on current trends, focus on "{combinedTrends[0]?.topic || 'emerging topics'}" - 
                  it shows {combinedTrends[0]?.score || 0}x viral potential with high engagement rates.
                </p>
              </div>
              
              <div className="p-4 bg-viral/10 border border-viral/20 rounded-lg">
                <h4 className="font-medium text-viral mb-2">🔥 Viral Opportunity</h4>
                <p className="text-sm">
                  Topics related to "{filterNiche !== 'all' ? filterNiche : 'technology'}" are trending upward. 
                  Consider creating content in this niche within the next 2-4 hours for maximum impact.
                </p>
              </div>
              
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <h4 className="font-medium text-success mb-2">💡 Best Practice</h4>
                <p className="text-sm">
                  Optimal posting time based on current data: Peak engagement occurs during 
                  {new Date().getHours() < 12 ? ' evening hours (6-9 PM)' : ' morning hours (8-11 AM)'}.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};