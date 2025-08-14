import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEO from "@/components/SEO";
import { PostGenerator } from "@/components/PostGenerator";
import { ContentOptimizer } from "@/components/ContentOptimizer";
import { AdvancedTrendAnalysis } from "@/components/AdvancedTrendAnalysis";

const Generate = () => {
  const navigate = useNavigate();

  return (
    <main className="container mx-auto px-4 py-6">
      <SEO
        title="Generate Viral Reddit Post"
        description="Use Gemini Pro to generate viral-ready Reddit posts with media suggestions."
        canonical="/generate"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Generate Viral Reddit Post",
          description:
            "Use Gemini Pro to generate viral-ready Reddit posts with media suggestions.",
        }}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Generate Viral Reddit Post</h1>
        <p className="text-muted-foreground mt-1">
          Craft optimized posts, preview output, attach media, and opt-in to auto-post.
        </p>
      </header>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Post</TabsTrigger>
          <TabsTrigger value="optimize">Content Optimizer</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="mt-6">
          <Card className="p-4 bg-card/60 backdrop-blur">
            <PostGenerator onClose={() => navigate("/")} />
          </Card>
        </TabsContent>
        
        <TabsContent value="optimize" className="mt-6">
          <ContentOptimizer />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-6">
          <AdvancedTrendAnalysis />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Generate;
