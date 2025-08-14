import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendChart } from "@/components/TrendChart";
import { AnalyticsWidget } from "@/components/AnalyticsWidget";
import { ROIAnalytics } from "@/components/ROIAnalytics";
import { AdvancedTrendAnalysis } from "@/components/AdvancedTrendAnalysis";
import { RealTimeEngagement } from "@/components/RealTimeEngagement";
import { api } from "@/api/client";
import { Loader2, Search, Calendar, BarChart3, TrendingUp, Users, MessageCircle, Eye } from "lucide-react";

const Analytics = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ["analytics", selectedTopic],
    queryFn: () => api.analytics({ topic: selectedTopic || "overall" }),
    enabled: true
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
          <p className="text-destructive">Failed to load analytics data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const data = analyticsData || {};

  return (
    <div className="container mx-auto px-4 py-6">
      <SEO
        title="Analytics & Performance"
        description="Deep dive into post performance, ROI metrics, and content analytics."
        canonical="/analytics"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AnalyticsPage",
          name: "Analytics Dashboard",
        }}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics & Performance</h1>
        <p className="text-muted-foreground mt-1">
          Deep insights into your content performance and ROI metrics.
        </p>
      </header>

      {/* Topic Filter */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Filter by Topic</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter topic to analyze (leave empty for overall)"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            />
            <Button variant="outline">
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-Time</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* ROI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {data.roi_metrics?.roi_percentage || "+1250%"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cost: ${data.roi_metrics?.cost_per_post || "0.02"} per post
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.engagement_metrics?.total_posts || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg Score: {data.engagement_metrics?.avg_virality_score || "0"}/10
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.engagement_metrics?.total_impressions?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Engagement Rate: {data.engagement_metrics?.engagement_rate || "0%"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {data.engagement_metrics?.growth_rate || "+23.5%"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
                <TrendChart />
              </div>
            </Card>
            <ROIAnalytics />
          </div>

          <AnalyticsWidget />

          {/* Best Performing Post */}
          {data.engagement_metrics?.best_performing_post && (
            <Card>
              <CardHeader>
                <CardTitle>🏆 Best Performing Post</CardTitle>
                <CardDescription>
                  Your highest scoring content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-gradient-to-r from-viral/10 to-success/10 border border-viral/20">
                  <h3 className="font-semibold mb-2">
                    {data.engagement_metrics.best_performing_post.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <Badge variant="outline" className="bg-viral/10 text-viral">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      {data.engagement_metrics.best_performing_post.score}/10
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{data.engagement_metrics.best_performing_post.engagement} engagement</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="realtime" className="mt-6">
          <RealTimeEngagement />
        </TabsContent>
        
        <TabsContent value="trends" className="mt-6">
          <AdvancedTrendAnalysis selectedNiches={[selectedTopic].filter(Boolean)} />
        </TabsContent>
        
        <TabsContent value="roi" className="mt-6 space-y-6">
          <ROIAnalytics />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Chart</h3>
                <TrendChart />
              </div>
            </Card>
            <AnalyticsWidget />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;