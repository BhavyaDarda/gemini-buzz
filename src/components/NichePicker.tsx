import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export type NichePickerProps = {
  suggestions?: string[];
  onChange?: (niches: string[]) => void;
};

export const NichePicker = ({ suggestions = [], onChange }: NichePickerProps) => {
  const [value, setValue] = useState("");
  const [niches, setNiches] = useState<string[]>([]);

  const addNiche = (n: string) => {
    if (!n) return;
    const next = Array.from(new Set([...niches, n]));
    setNiches(next);
    onChange?.(next);
    setValue("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Add a niche (e.g. AI, Fitness, Crypto)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addNiche(value.trim());
          }}
        />
        <button className="text-sm underline" onClick={() => addNiche(value.trim())}>
          Add
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <Badge key={s} variant="secondary" onClick={() => addNiche(s)}>
              {s}
            </Badge>
          ))}
        </div>
      )}
      {niches.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {niches.map((n) => (
            <Badge key={n} variant="outline">{n}</Badge>
          ))}
        </div>
      )}
    </div>
  );
};
