import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Target, Zap, Loader2 } from "lucide-react";
import { api } from "@/api/client";

interface ROIMetric {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
}

export const ROIAnalytics = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["roi-analytics"],
    queryFn: () => api.analytics({ topic: "overall" }),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-success" />
            ROI Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const roiMetrics: ROIMetric[] = [
    {
      label: "ROI Percentage",
      value: analyticsData?.roi_metrics?.roi_percentage || "+0%",
      change: "+15.2%",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      label: "Cost per Post",
      value: `$${analyticsData?.roi_metrics?.cost_per_post || 0}`,
      change: "-12%",
      icon: DollarSign,
      color: "text-primary"
    },
    {
      label: "Value Generated",
      value: `$${analyticsData?.roi_metrics?.total_value_generated || 0}`,
      change: "+23%",
      icon: Zap,
      color: "text-viral"
    },
    {
      label: "Cost per Impression",
      value: `$${analyticsData?.roi_metrics?.cost_per_impression || 0}`,
      change: "-8%",
      icon: Target,
      color: "text-muted-foreground"
    }
  ];

  const engagementValue = parseFloat(analyticsData?.engagement_metrics?.engagement_rate?.replace('%', '') || '0');

  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-success" />
            ROI Analytics
          </div>
          <Badge variant="secondary" className="bg-success/10 text-success">
            {analyticsData?.roi_metrics?.roi_percentage || "+0%"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Return on investment and cost analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ROI Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {roiMetrics.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {metric.change}
                </Badge>
              </div>
              <div className="text-lg font-semibold">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Engagement Performance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Engagement Performance</span>
            <span className="text-sm text-muted-foreground">{engagementValue}%</span>
          </div>
          <Progress value={engagementValue} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Poor</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Value Breakdown */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Value Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg. Impressions/Post</span>
              <span>{analyticsData?.roi_metrics?.avg_impressions_per_post?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Value per Engagement</span>
              <span>${analyticsData?.roi_metrics?.estimated_value_per_engagement || 0}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Posts</span>
              <span>{analyticsData?.engagement_metrics?.total_posts || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};