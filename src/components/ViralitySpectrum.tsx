import { Slider } from "@/components/ui/slider";

export type ViralitySpectrumProps = {
  value: number[];
  onChange: (v: number[]) => void;
};

export const ViralitySpectrum = ({ value, onChange }: ViralitySpectrumProps) => {
  return (
    <div className="space-y-2">
      <div className="text-sm">Virality Spectrum</div>
      <Slider
        value={value}
        onValueChange={onChange}
        min={0}
        max={100}
        step={1}
        className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-border"
      />
      <div className="text-xs text-muted-foreground">Target {value[0]}%</div>
    </div>
  );
};
