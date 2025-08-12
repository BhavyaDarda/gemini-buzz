import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, BarChart3, TrendingUp, Users, MessageCircle, Share2, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/api/client";

export const RecentPosts = () => {
  const { data: historyData, isLoading, error } = useQuery({
    queryKey: ["recent-posts"],
    queryFn: api.history,
  });

  const recentPosts = historyData?.posts?.slice(0, 4) || [];

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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Failed to load recent posts</p>
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No posts generated yet</p>
          </div>
        ) : (
          recentPosts.map((post: any) => (
            <div key={post.id} className="p-4 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/40 transition-all duration-200">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-sm line-clamp-2 flex-1 mr-3">
                  {post.title}
                </h4>
                <div className="flex items-center space-x-2 shrink-0">
                  <Badge 
                    variant={post.posted_flag ? 'default' : 'outline'}
                    className={`text-xs ${
                      post.posted_flag 
                        ? 'bg-success/10 text-success' 
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {post.posted_flag ? 'posted' : 'generated'}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-viral/10 text-viral">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    {post.virality_score || 0}
                  </Badge>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-3">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                    {post.subreddit || 'r/general'}
                  </span>
                  <span>
                    {post.created_at 
                      ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
                      : 'Recently'
                    }
                  </span>
                </div>
              </div>

              {/* Stats */}
              {post.posted_flag && post.actual_engagement && (
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{post.actual_engagement.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-success">
                      <TrendingUp className="h-3 w-3" />
                      <span>{post.performance || 'Good'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {post.posted_flag && post.reddit_post_id ? (
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={`https://reddit.com/comments/${post.reddit_post_id}`} target="_blank" rel="noopener noreferrer">
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
          ))
        )}

        <Button variant="outline" className="w-full mt-4" onClick={() => window.location.href = '/history'}>
          View All Posts
        </Button>
      </CardContent>
    </Card>
  );
};