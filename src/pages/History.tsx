import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";

const History = () => {
  return (
    <main className="container mx-auto px-4 py-6">
      <SEO
        title="Post History & Performance"
        description="Review generated posts, posting status, and performance metrics."
        canonical="/history"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Post History",
          description:
            "Review generated posts, posting status, and performance metrics.",
        }}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Post History</h1>
        <p className="text-muted-foreground mt-1">
          Your generated posts, virality scores, and Reddit posting status.
        </p>
      </header>

      <Card className="p-4 bg-card/60 backdrop-blur">
        <p className="text-muted-foreground">
          History view coming soon: we’ll sync generated posts and their performance
          once data is connected.
        </p>
      </Card>
    </main>
  );
};

export default History;
