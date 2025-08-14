import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Flame, ArrowUp, Eye, MessageCircle, Loader2, Radio } from "lucide-react";
import { api } from "@/api/client";
import { useTrendsStream } from "@/hooks/useTrendsStream";


const hotSubreddits = [
  { name: "r/productivity", activity: 98, trending: true },
  { name: "r/entrepreneur", activity: 94, trending: true },
  { name: "r/technology", activity: 91, trending: false },
  { name: "r/personalfinance", activity: 87, trending: true },
  { name: "r/getmotivated", activity: 84, trending: false }
];

export const TrendingTopics = () => {
  const { data: trendsData, isLoading, error } = useQuery({
    queryKey: ["trends"],
    queryFn: () => api.trends({ window: "24h", limit: 10 }),
    refetchInterval: 5 * 60 * 1000,
  });
  const { latestTrends } = useTrendsStream();

  const trends = [...(latestTrends || []), ...(trendsData?.trends || [])].slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-viral" />
            <span>Trending Topics</span>
            <Badge variant="outline" className="ml-2 text-xs flex items-center gap-1"><Radio className="h-3 w-3"/> Live</Badge>
          </CardTitle>
          <CardDescription>
            Hot topics with viral potential right now
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Failed to load trends</p>
            </div>
          ) : trends.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No trending topics available</p>
            </div>
          ) : (
            trends.map((trend: any, index: number) => (
              <div key={trend.id || index} className="p-3 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/40 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{trend.topic}</h4>
                  <div className="flex items-center space-x-2">
                    {trend.growth_rate && (
                      <Badge 
                        variant={trend.growth_rate.startsWith('+') ? "default" : "outline"}
                        className={`text-xs ${trend.growth_rate.startsWith('+') ? 'bg-success/10 text-success' : 'text-muted-foreground'}`}
                      >
                        <ArrowUp className={`h-3 w-3 mr-1 ${trend.growth_rate.startsWith('-') ? 'rotate-180' : ''}`} />
                        {trend.growth_rate}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs bg-viral/10 text-viral">
                      {Math.round(trend.score * 10) / 10}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">Trending</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{trend.impressions?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <span className={`font-medium ${
                      trend.engagement === 'Very High' ? 'text-success' :
                      trend.engagement === 'High' ? 'text-viral' : 'text-warning'
                    }`}>
                      {trend.engagement || 'Medium'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Hot Subreddits */}
      <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Hot Subreddits</span>
          </CardTitle>
          <CardDescription>
            Most active communities for posting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {hotSubreddits.map((subreddit, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {subreddit.trending && (
                    <Flame className="h-3 w-3 text-viral animate-pulse" />
                  )}
                  <span className="font-medium text-sm">{subreddit.name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-muted/50 rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-viral rounded-full transition-all duration-500"
                    style={{ width: `${subreddit.activity}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-8 text-right">{subreddit.activity}</span>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full mt-4" size="sm">
            View All Communities
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};