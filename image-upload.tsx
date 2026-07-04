import { ChangeEvent, useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageUpload({
  value,
  onChange,
  className,
}: {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  className?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {value ? (
        <div className="relative flex items-center gap-4 rounded-2xl border border-border bg-muted/30 p-3">
          <img src={value} alt="preview" className="h-16 w-16 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">Profile image ready</div>
            <div className="text-xs text-muted-foreground">Click below to replace or remove.</div>
          </div>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition",
            dragging
              ? "border-teal bg-teal/5"
              : "border-border bg-muted/30 hover:border-teal hover:bg-teal/5",
          )}
        >
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-gradient text-white">
            <Upload className="h-5 w-5" />
          </div>
          <div className="text-sm font-medium">Drop image here or click to upload</div>
          <div className="text-xs text-muted-foreground">PNG, JPG up to 5 MB</div>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
      />
      {!value && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="h-3.5 w-3.5" /> Recommended 400×400 square
        </div>
      )}
    </div>
  );
}
