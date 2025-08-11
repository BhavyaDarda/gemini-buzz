import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle } from "lucide-react";

const mockMetrics = [
  { label: "Engagement Rate", value: 87, color: "bg-success", icon: Heart },
  { label: "Click-through Rate", value: 65, color: "bg-viral", icon: Eye },
  { label: "Comment Rate", value: 43, color: "bg-primary", icon: MessageCircle },
  { label: "Share Rate", value: 29, color: "bg-warning", icon: TrendingUp }
];

const topPerformers = [
  { 
    title: "10 Life-Changing Productivity Hacks",
    subreddit: "r/productivity",
    score: 9.2,
    views: "45.2K",
    engagement: "18.5%"
  },
  {
    title: "Why Everyone is Wrong About Crypto",
    subreddit: "r/cryptocurrency", 
    score: 8.9,
    views: "38.7K",
    engagement: "16.2%"
  },
  {
    title: "I Built an AI That Made Me $10K",
    subreddit: "r/entrepreneur",
    score: 8.7,
    views: "32.1K", 
    engagement: "15.8%"
  }
];

export const AnalyticsWidget = () => {
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
          {mockMetrics.map((metric, index) => (
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
          ))}
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
          {topPerformers.map((post, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium line-clamp-2 flex-1 mr-2">
                  {post.title}
                </h4>
                <Badge variant="outline" className="text-xs bg-viral/10 text-viral shrink-0">
                  {post.score}/10
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-primary">{post.subreddit}</span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{post.engagement}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};