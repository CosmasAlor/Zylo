"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Copy, Search, Image as ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  fileType: string;
  size: number;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/media");
      const data = await res.json();
      setMedia(data);
    } catch {
      toast.error("Failed to load media library");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const res = await fetch("/api/media", {
          method: "POST",
          body: JSON.stringify({
            fileData: base64,
            filename: file.name,
            fileType: file.type,
          }),
        });

        if (res.ok) {
          toast.success("Image uploaded successfully");
          fetchMedia();
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          const error = await res.json();
          toast.error(error.error || "Upload failed");
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("An error occurred during upload");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("Image deleted");
        setMedia(media.filter((item) => item.id !== id));
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("An error occurred during deletion");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast.success("URL copied to clipboard");
  };

  const filteredMedia = media.filter((item) =>
    item.filename.toLowerCase().includes(search.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <main className="container-app py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Media Library</h1>
          <p className="text-muted-foreground">Manage and reuse all images across your site. Drag and drop to upload.</p>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative mb-8 p-8 border-2 border-dashed rounded-2xl transition-all duration-300 ${
          dragActive
            ? "border-primary/60 bg-primary/10"
            : "border-border/50 bg-muted/3 hover:border-primary/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
          onChange={handleUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={uploading}
          multiple
        />

        <div className="text-center pointer-events-none">
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm font-medium">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-primary/60 mx-auto mb-3" />
              <p className="text-sm font-medium mb-1">Drop images here to upload</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP, SVG • Max 5MB</p>
            </>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-8 bg-card/50 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input
          placeholder="Search images by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none focus-visible:ring-0 bg-transparent"
        />
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
          <p className="text-muted-foreground animate-pulse">Scanning library...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/5">
          <ImageIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No images found</h3>
          <p className="text-sm text-muted-foreground">
            {search ? "No results match your search." : "Start by uploading your first image."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <AnimatePresence>
            {filteredMedia.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group overflow-hidden border-white/10 bg-card/50 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-0 relative aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 px-2">
                      <Button
                        size="sm"
                        className="w-full gap-2 h-8 text-xs font-semibold"
                        onClick={() => copyUrl(item.url)}
                      >
                        <Copy className="h-3 w-3" />
                        Copy Link
                      </Button>
                      <Button
                        size="sm"
                        className="w-full gap-2 h-8 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-white truncate">{item.filename}</p>
                      <p className="text-xs text-gray-300">{formatFileSize(item.size)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-8 p-4 bg-muted/5 rounded-xl border border-border/50">
        <p className="text-sm text-muted-foreground">
          <strong>Total images:</strong> {media.length} • <strong>Storage used:</strong>{" "}
          {formatFileSize(media.reduce((sum, item) => sum + item.size, 0))}
        </p>
      </div>
    </main>
  );
}
