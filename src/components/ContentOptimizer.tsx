import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Target, TrendingUp, AlertTriangle, CheckCircle, Brain, Loader2 } from "lucide-react";
import { api } from "@/api/client";

interface OptimizationSuggestion {
  type: 'improvement' | 'warning' | 'success';
  category: string;
  message: string;
  impact: 'low' | 'medium' | 'high';
}

interface ContentScore {
  overall: number;
  virality: number;
  engagement: number;
  readability: number;
  seo: number;
}

interface ContentOptimizerProps {
  initialContent?: string;
  onOptimizedContent?: (content: string) => void;
}

export const ContentOptimizer = ({ initialContent = "", onOptimizedContent }: ContentOptimizerProps) => {
  const [content, setContent] = useState(initialContent);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState("");
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);

  // Simulate content analysis
  const analyzeContent = (text: string): ContentScore => {
    const wordCount = text.split(' ').length;
    const hasHashtags = text.includes('#');
    const hasQuestions = text.includes('?');
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(text);
    const hasCallToAction = /\b(share|comment|upvote|like|follow|subscribe)\b/i.test(text);
    
    return {
      overall: Math.min(100, (wordCount * 2) + (hasHashtags ? 15 : 0) + (hasQuestions ? 10 : 0) + (hasEmojis ? 10 : 0) + (hasCallToAction ? 15 : 0)),
      virality: hasEmojis && hasHashtags ? 85 : 60,
      engagement: hasQuestions && hasCallToAction ? 90 : 65,
      readability: wordCount > 50 && wordCount < 200 ? 95 : 70,
      seo: hasHashtags ? 80 : 55
    };
  };

  const generateSuggestions = (text: string): OptimizationSuggestion[] => {
    const suggestions: OptimizationSuggestion[] = [];
    
    if (!text.includes('?')) {
      suggestions.push({
        type: 'improvement',
        category: 'Engagement',
        message: 'Add a question to encourage user interaction',
        impact: 'medium'
      });
    }
    
    if (!/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(text)) {
      suggestions.push({
        type: 'improvement',
        category: 'Virality',
        message: 'Consider adding relevant emojis to increase visual appeal',
        impact: 'low'
      });
    }
    
    if (!text.includes('#')) {
      suggestions.push({
        type: 'warning',
        category: 'Discoverability',
        message: 'Add hashtags to improve discoverability',
        impact: 'high'
      });
    }
    
    if (text.split(' ').length < 50) {
      suggestions.push({
        type: 'improvement',
        category: 'Content Depth',
        message: 'Consider expanding your content for better engagement',
        impact: 'medium'
      });
    }
    
    if (text.split(' ').length > 300) {
      suggestions.push({
        type: 'warning',
        category: 'Readability',
        message: 'Content might be too long for optimal Reddit engagement',
        impact: 'medium'
      });
    }
    
    if (!/\b(share|comment|upvote|like|follow|subscribe)\b/i.test(text)) {
      suggestions.push({
        type: 'improvement',
        category: 'Call to Action',
        message: 'Add a clear call-to-action to drive engagement',
        impact: 'high'
      });
    }
    
    return suggestions;
  };

  const contentScore = analyzeContent(content);
  const contentSuggestions = generateSuggestions(content);

  const handleOptimize = async () => {
    if (!content.trim()) return;
    
    setIsOptimizing(true);
    
    try {
      // Simulate AI optimization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let optimized = content;
      
      // Apply optimizations based on suggestions
      if (!content.includes('?')) {
        optimized += " What are your thoughts on this?";
      }
      
      if (!content.includes('#')) {
        optimized += " #reddit #viral #trending";
      }
      
      if (!/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(content)) {
        optimized = "🔥 " + optimized;
      }
      
      if (!/\b(share|comment|upvote|like|follow|subscribe)\b/i.test(content)) {
        optimized += "\n\nWhat do you think? Share your experiences in the comments!";
      }
      
      setOptimizedContent(optimized);
      setSuggestions(generateSuggestions(optimized));
      onOptimizedContent?.(optimized);
      
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const getSuggestionIcon = (type: OptimizationSuggestion['type']) => {
    switch (type) {
      case 'improvement': return TrendingUp;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
    }
  };

  const getSuggestionColor = (impact: OptimizationSuggestion['impact']) => {
    switch (impact) {
      case 'low': return 'text-muted-foreground';
      case 'medium': return 'text-warning';
      case 'high': return 'text-viral';
    }
  };

  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Content Optimizer
        </CardTitle>
        <CardDescription>
          AI-powered suggestions to maximize your content's viral potential
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="optimize">Optimize</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyze" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Content to Analyze</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your Reddit post content here for AI analysis..."
                className="min-h-32"
              />
            </div>

            {content && (
              <>
                {/* Content Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Score</span>
                        <span className="font-medium">{contentScore.overall}/100</span>
                      </div>
                      <Progress value={contentScore.overall} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Virality</span>
                        <span className="font-medium">{contentScore.virality}/100</span>
                      </div>
                      <Progress value={contentScore.virality} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement</span>
                        <span className="font-medium">{contentScore.engagement}/100</span>
                      </div>
                      <Progress value={contentScore.engagement} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Readability</span>
                        <span className="font-medium">{contentScore.readability}/100</span>
                      </div>
                      <Progress value={contentScore.readability} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>SEO Score</span>
                        <span className="font-medium">{contentScore.seo}/100</span>
                      </div>
                      <Progress value={contentScore.seo} className="h-2" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        {content.split(' ').length} words
                      </span>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Optimization Suggestions</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {contentSuggestions.map((suggestion, index) => {
                      const Icon = getSuggestionIcon(suggestion.type);
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 bg-card/50 rounded-lg">
                          <Icon className={`h-4 w-4 mt-0.5 ${getSuggestionColor(suggestion.impact)}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{suggestion.category}</span>
                              <Badge variant="outline" className="text-xs">
                                {suggestion.impact} impact
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{suggestion.message}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="optimize" className="space-y-4">
            <div className="flex gap-3">
              <Button 
                onClick={handleOptimize} 
                disabled={!content.trim() || isOptimizing}
                className="flex items-center gap-2"
              >
                {isOptimizing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                {isOptimizing ? 'Optimizing...' : 'Optimize Content'}
              </Button>
              
              {optimizedContent && (
                <Button 
                  variant="outline" 
                  onClick={() => setContent(optimizedContent)}
                >
                  Apply Optimizations
                </Button>
              )}
            </div>

            {optimizedContent && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Optimized Content</label>
                <Textarea
                  value={optimizedContent}
                  onChange={(e) => setOptimizedContent(e.target.value)}
                  className="min-h-32"
                  readOnly
                />
                
                <div className="grid grid-cols-3 gap-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-success">
                      +{Math.max(0, analyzeContent(optimizedContent).overall - contentScore.overall)}
                    </div>
                    <div className="text-xs text-muted-foreground">Overall Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-viral">
                      +{Math.max(0, analyzeContent(optimizedContent).virality - contentScore.virality)}
                    </div>
                    <div className="text-xs text-muted-foreground">Virality</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">
                      +{Math.max(0, analyzeContent(optimizedContent).engagement - contentScore.engagement)}
                    </div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};