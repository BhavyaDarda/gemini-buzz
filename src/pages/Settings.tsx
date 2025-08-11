import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Settings = () => {
  return (
    <main className="container mx-auto px-4 py-6">
      <SEO
        title="Settings"
        description="Manage connections like Reddit OAuth, media providers, and AI settings."
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
          <Button variant="default" disabled>
            Connect Reddit (coming soon)
          </Button>
        </Card>

        <Card className="p-4 bg-card/60 backdrop-blur">
          <h2 className="font-medium mb-2">Media Provider</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Choose Cloudinary or Imgur to host images, GIFs, or videos.
          </p>
          <Button variant="secondary" disabled>
            Configure Provider (coming soon)
          </Button>
        </Card>
      </div>
    </main>
  );
};

export default Settings;
