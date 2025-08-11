import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export type MediaUploaderProps = {
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
};

export const MediaUploader = ({
  accept = "image/*,video/*",
  multiple = true,
  onFilesSelected,
}: MediaUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handlePick = () => inputRef.current?.click();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setPreviews(files.map((f) => URL.createObjectURL(f)));
      onFilesSelected?.(files);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <Button variant="secondary" onClick={handlePick}>Select Media</Button>
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {previews.map((src) => (
            <img
              key={src}
              src={src}
              alt="Selected media preview"
              className="rounded-md border border-border object-cover aspect-video"
            />
          ))}
        </div>
      )}
    </div>
  );
};
