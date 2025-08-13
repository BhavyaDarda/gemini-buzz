import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, Loader2 } from "lucide-react";
import { api } from "@/api/client";

const mockMetrics = [
  { label: "Engagement Rate", value: 87, color: "bg-success", icon: Heart },
  { label: "Click-through Rate", value: 65, color: "bg-viral", icon: Eye },
  { label: "Comment Rate", value: 43, color: "bg-primary", icon: MessageCircle },
  { label: "Share Rate", value: 29, color: "bg-warning", icon: TrendingUp }
];

export const AnalyticsWidget = () => {
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["analytics-history"],
    queryFn: api.history,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics-overall"],
    queryFn: () => api.analytics({ topic: "overall" }),
    refetchInterval: 60 * 1000,
  });

  const isLoading = historyLoading || analyticsLoading;
  const topPerformers = historyData?.posts?.slice(0, 3) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Metrics */}
      <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Performance Metrics</span>
          </CardTitle>
          <CardDescription>
            Average performance across all posts this month
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            mockMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>
                  <span className="text-sm font-semibold">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-viral" />
            <span>Top Performers</span>
          </CardTitle>
          <CardDescription>
            Your highest scoring posts this month
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : topPerformers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No posts available</p>
            </div>
          ) : (
            topPerformers.map((post: any, index: number) => (
              <div key={post.id || index} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium line-clamp-2 flex-1 mr-2">
                    {post.title}
                  </h4>
                  <Badge variant="outline" className="text-xs bg-viral/10 text-viral shrink-0">
                    {post.virality_score || 0}/10
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium text-primary">{post.subreddit || 'r/general'}</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{post.actual_engagement?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{post.performance || 'Good'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};