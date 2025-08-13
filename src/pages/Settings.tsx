import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RedditConnector } from "@/components/RedditConnector";


const Settings = () => {
  return (
    <main className="container mx-auto px-4 py-6">
      <SEO
        title="Settings"
        description="Manage Reddit OAuth and AI preferences."
        canonical="/settings"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "AI Reddit Post Generator Settings",
        }}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Connect Reddit, choose media provider, and configure AI preferences.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 bg-card/60 backdrop-blur">
          <h2 className="font-medium mb-2">Reddit Connection</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Connect your Reddit account to enable auto-posting.
          </p>
          <RedditConnector />
        </Card>

        <Card className="p-4 bg-card/60 backdrop-blur">
          <h2 className="font-medium mb-2">Media Storage</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Media is hosted securely using Supabase Storage.
          </p>
          <Button variant="secondary" disabled>
            No configuration required
          </Button>
        </Card>
      </div>
    </main>
  );
};

export default Settings;
