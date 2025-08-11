import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, BarChart3, TrendingUp, Users, MessageCircle, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const recentPosts = [
  {
    id: 1,
    title: "The AI Tool That Revolutionized My Workflow",
    subreddit: "r/productivity",
    status: "posted",
    viralScore: 9.1,
    views: "23.4K",
    upvotes: 1247,
    comments: 189,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    redditUrl: "https://reddit.com/r/productivity/comments/abc123"
  },
  {
    id: 2,
    title: "Why I Quit My 6-Figure Job to Build an App",
    subreddit: "r/entrepreneur", 
    status: "posted",
    viralScore: 8.7,
    views: "18.9K",
    upvotes: 892,
    comments: 156,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    redditUrl: "https://reddit.com/r/entrepreneur/comments/def456"
  },
  {
    id: 3,
    title: "Crypto Predictions That Aged Like Wine",
    subreddit: "r/cryptocurrency",
    status: "generated",
    viralScore: 8.3,
    views: "0",
    upvotes: 0,
    comments: 0,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    redditUrl: null
  },
  {
    id: 4,
    title: "How I Learned Japanese in 3 Months",
    subreddit: "r/languagelearning",
    status: "posted",
    viralScore: 7.9,
    views: "12.3K",
    upvotes: 567,
    comments: 89,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    redditUrl: "https://reddit.com/r/languagelearning/comments/ghi789"
  }
];

export const RecentPosts = () => {
  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Recent Posts</span>
        </CardTitle>
        <CardDescription>
          Your latest generated and posted content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentPosts.map((post) => (
          <div key={post.id} className="p-4 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/40 transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-sm line-clamp-2 flex-1 mr-3">
                {post.title}
              </h4>
              <div className="flex items-center space-x-2 shrink-0">
                <Badge 
                  variant={post.status === 'posted' ? 'default' : 'outline'}
                  className={`text-xs ${
                    post.status === 'posted' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-warning/10 text-warning'
                  }`}
                >
                  {post.status}
                </Badge>
                <Badge variant="outline" className="text-xs bg-viral/10 text-viral">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  {post.viralScore}
                </Badge>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <div className="flex items-center space-x-3">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                  {post.subreddit}
                </span>
                <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
              </div>
            </div>

            {/* Stats */}
            {post.status === 'posted' && (
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>{post.upvotes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-primary">
                    <MessageCircle className="h-3 w-3" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {post.status === 'posted' && post.redditUrl ? (
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={post.redditUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-2" />
                    View on Reddit
                  </a>
                </Button>
              ) : (
                <Button variant="viral" size="sm" className="flex-1">
                  <Share2 className="h-3 w-3 mr-2" />
                  Post to Reddit
                </Button>
              )}
              <Button variant="ghost" size="sm">
                Analytics
              </Button>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full mt-4">
          View All Posts
        </Button>
      </CardContent>
    </Card>
  );
};