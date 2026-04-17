"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Copy, Search, Image as ImageIcon } from "lucide-react";
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
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
        } else {
          toast.error("Upload failed");
        }
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("An error occurred during upload");
    } finally {
      setUploading(false);
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

  return (
    <main className="container-app py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Media Library</h1>
          <p className="text-muted-foreground">Manage and reuse all images across your site.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              disabled={uploading}
            />
            <Button disabled={uploading} className="gap-2 shadow-lg shadow-primary/20">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Upload New Image
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8 bg-card/50 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input
          placeholder="Search images by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none focus-visible:ring-0 bg-transparent"
        />
      </div>

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
                <Card className="group overflow-hidden border-white/10 bg-card/50 hover:border-primary/50 transition-all duration-300">
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
                        variant="secondary"
                        className="w-full gap-2 h-8 text-xs font-semibold"
                        onClick={() => copyUrl(item.url)}
                      >
                        <Copy className="h-3 w-3" />
                        Copy Link
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-2 h-8 text-xs font-semibold text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                       <p className="text-[10px] text-white truncate font-medium">{item.filename}</p>
                       <p className="text-[8px] text-white/60">{(item.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
