import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Flame, ArrowUp, Eye, MessageCircle } from "lucide-react";

const trendingTopics = [
  {
    topic: "AI Productivity Tools",
    score: 94,
    change: +12,
    category: "Technology",
    posts: 1247,
    engagement: "Very High"
  },
  {
    topic: "Remote Work Tips",
    score: 89,
    change: +8,
    category: "Lifestyle", 
    posts: 892,
    engagement: "High"
  },
  {
    topic: "Crypto Market Analysis",
    score: 85,
    change: -3,
    category: "Finance",
    posts: 1563,
    engagement: "High"
  },
  {
    topic: "Mental Health Awareness",
    score: 82,
    change: +15,
    category: "Health",
    posts: 734,
    engagement: "Medium"
  },
  {
    topic: "Startup Success Stories", 
    score: 78,
    change: +5,
    category: "Business",
    posts: 456,
    engagement: "Medium"
  }
];

const hotSubreddits = [
  { name: "r/productivity", activity: 98, trending: true },
  { name: "r/entrepreneur", activity: 94, trending: true },
  { name: "r/technology", activity: 91, trending: false },
  { name: "r/personalfinance", activity: 87, trending: true },
  { name: "r/getmotivated", activity: 84, trending: false }
];

export const TrendingTopics = () => {
  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-viral" />
            <span>Trending Topics</span>
          </CardTitle>
          <CardDescription>
            Hot topics with viral potential right now
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/40 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{topic.topic}</h4>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={topic.change > 0 ? "default" : "outline"}
                    className={`text-xs ${topic.change > 0 ? 'bg-success/10 text-success' : 'text-muted-foreground'}`}
                  >
                    <ArrowUp className={`h-3 w-3 mr-1 ${topic.change < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(topic.change)}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-viral/10 text-viral">
                    {topic.score}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded">{topic.category}</span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{topic.posts}</span>
                  </div>
                  <span className={`font-medium ${
                    topic.engagement === 'Very High' ? 'text-success' :
                    topic.engagement === 'High' ? 'text-viral' : 'text-warning'
                  }`}>
                    {topic.engagement}
                  </span>
                </div>
              </div>
            </div>
          ))}
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