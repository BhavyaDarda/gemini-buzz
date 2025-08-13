import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Target, Image, BarChart3, Copy, Send, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/api/client";
import { NichePicker } from "@/components/NichePicker";
import { ViralitySpectrum } from "@/components/ViralitySpectrum";
import { MediaUploader } from "@/components/MediaUploader";
import { ConsentToggle } from "@/components/ConsentToggle";

interface PostGeneratorProps {
  onClose: () => void;
}

export const PostGenerator = ({ onClose }: PostGeneratorProps) => {
  const [topic, setTopic] = useState("");
  const [subreddit, setSubreddit] = useState("");
  const [tone, setTone] = useState("");
  const [contentType, setContentType] = useState("text");
  const [niches, setNiches] = useState<string[]>([]);
  const [virality, setVirality] = useState<number[]>([70]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [autoPost, setAutoPost] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your post",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        topic,
        tone,
        content_type: contentType,
        subreddit_hint: subreddit,
        media_choice: contentType,
        model: "gemini-2.5-flash",
        niches,
        target_virality: virality[0]
      } as any;

      const result = await api.generate(payload);

      setGeneratedPost({
        title: result.title,
        content: result.content,
        viralScore: result.viralityScore,
        estimatedViews: result.estimatedViews,
        engagement: result.engagement,
        tags: result.tags || ["ai-generated"],
        mediaRec: result.mediaRecommendation,
        id: result.id,
        mediaUrls
      });

      toast({ title: "Post Generated!", description: `Virality score: ${result.viralityScore}/10` });
    } catch (error) {
      console.error('Generation error:', error);
      toast({ title: "Generation Failed", description: "Please try again or check your connection", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePostToReddit = async () => {
    if (!generatedPost) return;
    try {
      const getSessionId = () => {
        const key = 'reddit_session_id';
        let id = localStorage.getItem(key);
        if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); }
        return id;
      };

      const payload = {
        post_id: generatedPost.id,
        subreddit,
        auto_post_toggle: autoPost,
        consent: autoPost,
        title: generatedPost.title,
        content: generatedPost.content,
        session_id: autoPost ? getSessionId() : undefined,
      };

      const result = await api.post(payload as any);

      if (result.type === 'posted') {
        toast({ title: "Posted!", description: "Your post was submitted to Reddit" });
      } else if (result.oauth_url) {
        window.open(result.oauth_url, '_blank');
        toast({ title: "Connect Reddit", description: "Authorize Reddit, then try auto-post again." });
      } else if (result.manual_option) {
        window.open(result.manual_option.subreddit_url, '_blank');
        toast({ title: "Ready to Post!", description: "Reddit opened in new tab with your content ready to post" });
      } else {
        toast({ title: "Post Response", description: result.message || "Post processed" });
      }
    } catch (error) {
      console.error('Post error:', error);
      toast({ title: "Post Failed", description: "Please try again or post manually", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Post content copied to clipboard"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-viral" />
          <span className="font-semibold">AI Post Generator</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Input
                placeholder="e.g., productivity tips, crypto trading..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Subreddit</label>
              <Input
                placeholder="e.g., r/productivity, r/entrepreneur..."
                value={subreddit}
                onChange={(e) => setSubreddit(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual & Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="controversial">Controversial</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Post</SelectItem>
                  <SelectItem value="image">Image Post</SelectItem>
                  <SelectItem value="video">Video Post</SelectItem>
                  <SelectItem value="link">Link Post</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Niches</label>
              <NichePicker suggestions={["AI", "Fitness", "Crypto", "Productivity"]} onChange={setNiches} />
            </div>
            <div className="space-y-2">
              <ViralitySpectrum value={virality} onChange={setVirality} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Attach Media (optional)</label>
            <MediaUploader onFilesSelected={async (files) => {
              try {
                const uploads = await Promise.all(files.map((f) => api.uploadMedia(f)));
                setMediaUrls(uploads.map((u) => u.url));
                toast({ title: "Uploaded", description: `${uploads.length} file(s) uploaded` });
              } catch (e) {
                toast({ title: "Upload failed", description: "Please try again", variant: "destructive" });
              }
            }} />
          </div>

          <ConsentToggle checked={autoPost} onChange={setAutoPost} />

          <Button 
            variant="hero" 
            size="lg" 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating with AI...</span>
              </div>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Viral Post
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          {generatedPost ? (
            <Card className="bg-gradient-card backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{generatedPost.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-viral/10 text-viral">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      {generatedPost.viralScore}/10
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Estimated {generatedPost.estimatedViews} views • {generatedPost.engagement} engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedPost.content}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-2">
                  {generatedPost.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {generatedPost.mediaRec && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Image className="h-4 w-4 text-primary" />
                      <span className="font-medium">Media Recommendation:</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {generatedPost.mediaRec}
                    </p>
                  </div>
                )}

                {generatedPost.mediaUrls?.length ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {generatedPost.mediaUrls.map((src: string) => (
                      <img key={src} src={src} alt="Uploaded media" className="rounded-md border border-border object-cover aspect-video" />
                    ))}
                  </div>
                ) : null}


                <Separator />

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(generatedPost.title + "\\n\\n" + generatedPost.content)}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Post
                  </Button>
                  <Button variant="viral" className="flex-1" onClick={handlePostToReddit}>
                    <Send className="h-4 w-4 mr-2" />
                    Post to Reddit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Generate a post to see the preview</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};