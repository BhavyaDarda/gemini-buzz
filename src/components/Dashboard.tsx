import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendChart } from "@/components/TrendChart";
import { PostGenerator } from "@/components/PostGenerator";
import { AnalyticsWidget } from "@/components/AnalyticsWidget";
import { TrendingTopics } from "@/components/TrendingTopics";
import { RecentPosts } from "@/components/RecentPosts";
import { TrendingUp, Zap, BarChart3, PlusCircle, Settings, Users, Calendar } from "lucide-react";

export const Dashboard = () => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    viralScore: 0,
    totalViews: 0,
    engagementRate: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    setStats({
      totalPosts: 127,
      viralScore: 8.7,
      totalViews: 2456789,
      engagementRate: 12.4
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-hero rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Reddit AI Generator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create viral content with AI-powered insights
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setShowGenerator(!showGenerator)}
              >
                <PlusCircle className="h-5 w-5" />
                Generate Post
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Viral Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-viral" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-viral">{stats.viralScore}/10</div>
              <p className="text-xs text-muted-foreground">
                +0.7 from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +23% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.engagementRate}%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Post Generator Modal/Section */}
        {showGenerator && (
          <div className="mb-8">
            <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-viral" />
                  <span>AI Post Generator</span>
                  <Badge variant="secondary" className="ml-auto">
                    Powered by Gemini Pro
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Generate viral Reddit posts with AI-powered trend analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PostGenerator onClose={() => setShowGenerator(false)} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts & Analytics */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Viral Performance Trends</CardTitle>
                <CardDescription>
                  Track your content performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TrendChart />
              </CardContent>
            </Card>

            <AnalyticsWidget />
          </div>

          {/* Right Column - Trending & Recent */}
          <div className="space-y-6">
            <TrendingTopics />
            <RecentPosts />
          </div>
        </div>
      </div>
    </div>
  );
};