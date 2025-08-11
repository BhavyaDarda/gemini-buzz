import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type PostPreviewProps = {
  title: string;
  body: string;
  mediaUrls?: string[];
  subreddits?: string[];
  viralityScore?: number;
};

export const PostPreview = ({
  title,
  body,
  mediaUrls = [],
  subreddits = [],
  viralityScore,
}: PostPreviewProps) => {
  return (
    <Card className="p-4 bg-card/60 backdrop-blur space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          {subreddits.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {subreddits.map((sr) => (
                <Badge key={sr} variant="secondary">r/{sr}</Badge>
              ))}
            </div>
          )}
        </div>
        {viralityScore !== undefined && (
          <Badge variant="outline">Viral Score: {viralityScore}</Badge>
        )}
      </div>

      <p className="whitespace-pre-wrap text-sm text-muted-foreground">{body}</p>

      {mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {mediaUrls.map((url) => (
            <img
              key={url}
              src={url}
              alt={`Post media ${url}`}
              loading="lazy"
              className="rounded-md border border-border object-cover aspect-video"
            />
          ))}
        </div>
      )}
    </Card>
  );
};
