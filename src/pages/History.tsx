import { useQuery } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/api/client";
import { 
  Loader2, 
  Clock, 
  BarChart3, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  MessageCircle,
  Share2,
  Calendar
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const History = () => {
  const { data: historyData, isLoading, error, refetch } = useQuery({
    queryKey: ["history"],
    queryFn: api.history,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load post history</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { posts = [], summary = {} } = historyData || {};

  return (
    <div className="container mx-auto px-4 py-6">
      <SEO
        title="Post History & Performance"
        description="Review generated posts, posting status, and performance metrics."
        canonical="/history"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Post History",
          description: "Review generated posts, posting status, and performance metrics.",
        }}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Post History</h1>
        <p className="text-muted-foreground mt-1">
          Your generated posts, virality scores, and Reddit posting status.
        </p>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total_posts || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posted</CardTitle>
            <Share2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{summary.posted_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Successfully posted to Reddit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-viral" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-viral">
              {summary.avg_virality_score || 0}/10
            </div>
            <p className="text-xs text-muted-foreground">
              Virality score average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.success_rate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Posts successfully posted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Posts</span>
          </CardTitle>
          <CardDescription>
            Your generated and posted content with performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No posts generated yet</p>
              <Button className="mt-4" onClick={() => window.location.href = '/generate'}>
                Generate Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any) => (
                <div key={post.id} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-sm line-clamp-2 flex-1 mr-3">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-2 shrink-0">
                      <Badge 
                        variant={post.posted_flag ? 'default' : 'outline'}
                        className={`text-xs ${
                          post.posted_flag 
                            ? 'bg-success/10 text-success' 
                            : 'bg-warning/10 text-warning'
                        }`}
                      >
                        {post.posted_flag ? 'Posted' : 'Draft'}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-viral/10 text-viral">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        {post.virality_score || 0}/10
                      </Badge>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center space-x-3">
                      {post.subreddit && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                          {post.subreddit}
                        </span>
                      )}
                      <span>
                        {post.created_at 
                          ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
                          : 'Unknown time'
                        }
                      </span>
                    </div>
                    <span className="capitalize text-muted-foreground">
                      {post.topic || 'General'}
                    </span>
                  </div>

                  {/* Performance Stats */}
                  {post.actual_engagement && (
                    <div className="flex items-center space-x-4 mb-3 text-xs">
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{post.actual_engagement.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center space-x-1 text-success">
                        <TrendingUp className="h-3 w-3" />
                        <span>{post.performance || 'Unknown'}</span>
                      </div>
                    </div>
                  )}

                  {/* Content Preview */}
                  {post.content && (
                    <div className="bg-muted/30 rounded p-3 mb-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.content}
                      </p>
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
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="h-3 w-3 mr-2" />
                        Post to Reddit
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="h-3 w-3 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;