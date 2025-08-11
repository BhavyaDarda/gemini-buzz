import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { PostGenerator } from "@/components/PostGenerator";

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
          Craft optimized posts, preview output, and get AI-suggested media.
        </p>
      </header>

      <Card className="p-4 bg-card/60 backdrop-blur">
        <PostGenerator onClose={() => navigate("/")} />
      </Card>
    </main>
  );
};

export default Generate;
