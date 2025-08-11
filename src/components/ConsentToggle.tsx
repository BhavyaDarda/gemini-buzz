import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export type ConsentToggleProps = {
  checked: boolean;
  onChange: (v: boolean) => void;
};

export const ConsentToggle = ({ checked, onChange }: ConsentToggleProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        <Switch id="auto-post" checked={checked} onCheckedChange={onChange} />
        <Label htmlFor="auto-post">Enable auto-post to Reddit</Label>
      </div>
      <p className="text-xs text-muted-foreground">
        Opt-in only. We will never post without your explicit consent.
      </p>
    </div>
  );
};
