"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Check, ImageIcon, X, Edit } from "lucide-react";
import { toast } from "sonner";

interface GalleryItem {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  caption: string | null;
  order: number;
}

interface MediaItem {
  id: string;
  url: string;
  filename: string;
}

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState<"before" | "after" | null>(null);

  useEffect(() => {
    Promise.all([fetchItems(), fetchMediaLibrary()]);
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery");
      const data = await res.json();

      if (!res.ok) {
        toast.error("Failed to load gallery");
        return;
      }

      if (!Array.isArray(data)) {
        toast.error("Failed to load gallery");
        return;
      }

      setItems(data);
    } catch (error) {
      toast.error("Failed to load gallery");
      console.error("Failed to load gallery", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMediaLibrary() {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMediaLibrary(data);
      }
    } catch (error) {
      console.error("Failed to load media library", error);
    }
  }

  const handleSave = async () => {
    if (!editingItem?.beforeUrl || !editingItem?.afterUrl) {
      toast.error("Both Before and After images are required");
      return;
    }

    if (!editingItem.caption || editingItem.caption.trim().length === 0) {
      toast.error("Caption is required");
      return;
    }

    try {
      setSaving(true);
      const method = isEditing ? "PATCH" : "POST";
      const body = isEditing 
        ? { id: editingItem.id, ...editingItem }
        : editingItem;

      const res = await fetch("/api/gallery", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(isEditing ? "Gallery item updated successfully" : "Gallery item added successfully");
        setEditingItem(null);
        setIsEditing(false);
        setShowMediaPicker(null);
        fetchItems();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to save item");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this transformation from the gallery?")) return;

    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("Item removed");
        setItems(items.filter((i) => i.id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete");
      console.error(error);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsEditing(false);
    setShowMediaPicker(null);
  };

  const selectMediaItem = (url: string) => {
    if (showMediaPicker === "before") {
      setEditingItem({ ...editingItem, beforeUrl: url });
    } else if (showMediaPicker === "after") {
      setEditingItem({ ...editingItem, afterUrl: url });
    }
    setShowMediaPicker(null);
  };

  return (
    <main className="container-app py-10 px-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Smile Transformations</h1>
          <p className="text-muted-foreground">Manage your Before & After gallery entries.</p>
        </div>
        {!editingItem && (
          <Button onClick={() => setEditingItem({})} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Transformation
          </Button>
        )}
      </div>

      {editingItem && (
        <Card className="mb-10 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{isEditing ? "Edit Transformation" : "New Transformation"}</CardTitle>
                <CardDescription>
                  {isEditing 
                    ? "Update the before and after images and caption for this transformation."
                    : "Select before and after images from your media library, then add a caption."
                  }
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Media Picker */}
            {showMediaPicker && (
              <div className="mb-6 p-4 bg-background/50 rounded-lg border border-primary/20">
                <h4 className="font-medium mb-4">
                  Select {showMediaPicker === "before" ? "Before" : "After"} Image
                </h4>
                <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                  {mediaLibrary.length > 0 ? (
                    mediaLibrary.map((item) => (
                      <div
                        key={item.id}
                        className="relative cursor-pointer group overflow-hidden rounded border border-border"
                        onClick={() => selectMediaItem(item.url)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={item.filename}
                          className="w-full aspect-square object-cover hover:scale-110 transition-transform"
                          onError={(e) => {
                            console.warn(`Failed to load image: ${item.url}`);
                            (e.target as HTMLImageElement).style.backgroundColor = "#f0f0f0";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-4 text-center text-sm text-muted-foreground py-8">
                      No images in media library. Please upload images first.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Before/After Image Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Before Image</Label>
                {editingItem.beforeUrl ? (
                  <div className="relative overflow-hidden rounded border border-border" style={{ height: "200px" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editingItem.beforeUrl}
                      alt="Before"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.warn("Image failed to load, showing fallback:", editingItem.beforeUrl);
                        const img = e.target as HTMLImageElement;
                        img.style.backgroundColor = "#f3f4f6";
                        img.style.display = "flex";
                        img.style.alignItems = "center";
                        img.style.justifyContent = "center";
                        img.style.color = "#6b7280";
                        img.style.fontSize = "12px";
                        img.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4QzQuOSAxOCA0IDE3LjEgNCAxNlY0QzQgMi45IDQuOSAyIDYgMkg5QzEwLjEgMiAxMSAyLjkgMTEgNFYxNkgxMloiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTEzIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4QzQuOSAxOCA0IDE3LjEgNCAxNlY0QzQgMi45IDQuOSAyIDYgMkg5QzEwLjEgMiAxMSAyLjkgMTEgNFYxNkgxMloiIGZpbGw9IiM2QjcyODAiLz4KPHJlY3QgeD0iMTMiIHk9IjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIHJ4PSIxIiBmaWxsPSIjNkI3MjgwIi8+Cjwvc3ZnPgo=";
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold">
                      BEFORE
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute bottom-2 right-2"
                      onClick={() => setShowMediaPicker("before")}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-32 border-dashed"
                    onClick={() => setShowMediaPicker("before")}
                  >
                    <ImageIcon className="h-6 w-6 mr-2" />
                    Select Before Image
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>After Image</Label>
                {editingItem.afterUrl ? (
                  <div className="relative overflow-hidden rounded border border-border" style={{ height: "200px" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editingItem.afterUrl}
                      alt="After"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.warn("Image failed to load, showing fallback:", editingItem.afterUrl);
                        const img = e.target as HTMLImageElement;
                        img.style.backgroundColor = "#f3f4f6";
                        img.style.display = "flex";
                        img.style.alignItems = "center";
                        img.style.justifyContent = "center";
                        img.style.color = "#6b7280";
                        img.style.fontSize = "12px";
                        img.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4QzQuOSAxOCA0IDE3LjEgNCAxNlY0QzQgMi45IDQuOSAyIDYgMkg5QzEwLjEgMiAxMSAyLjkgMTEgNFYxNkgxMloiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTEzIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4QzQuOSAxOCA0IDE3LjEgNCAxNlY0QzQgMi45IDQuOSAyIDYgMkg5QzEwLjEgMiAxMSAyLjkgMTEgNFYxNkgxMloiIGZpbGw9IiM2QjcyODAiLz4KPHJlY3QgeD0iMTMiIHk9IjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIHJ4PSIxIiBmaWxsPSIjNkI3MjgwIi8+Cjwvc3ZnPgo=";
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-1 rounded font-bold">
                      AFTER
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute bottom-2 right-2"
                      onClick={() => setShowMediaPicker("after")}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-32 border-dashed"
                    onClick={() => setShowMediaPicker("after")}
                  >
                    <ImageIcon className="h-6 w-6 mr-2" />
                    Select After Image
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Caption / Case Description</Label>
              <Input
                value={editingItem.caption || ""}
                onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                placeholder="e.g., Full Mouth Rehabilitation"
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving || !editingItem.beforeUrl || !editingItem.afterUrl}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                {isEditing ? "Update Transformation" : "Save Transformation"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed">
          <ImageIcon className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground">The gallery is empty. Add your first patient transformation above.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:border-primary/30 transition-colors">
              <CardContent className="p-0 flex flex-col md:flex-row h-full md:h-48">
                <div className="flex flex-1 bg-muted/5">
                  <div className="w-1/2 relative h-48 bg-muted/10 border-r border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.beforeUrl} 
                      alt="Before" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.warn("Gallery image failed to load:", item.beforeUrl);
                        const img = e.target as HTMLImageElement;
                        img.style.backgroundColor = "#f3f4f6";
                        img.style.display = "flex";
                        img.style.alignItems = "center";
                        img.style.justifyContent = "center";
                        img.style.color = "#6b7280";
                        img.style.fontSize = "10px";
                        img.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMkM4LjQgMiA5IDIuNiA5IDRWMTJDOSA5LjQgOC40IDEwIDggMTBDNy42IDEwIDcgOS40IDcgOFY0QzcgMi42IDcuNiAyIDggMkgxMUM4LjQgMiA5IDIuNiA5IDRWOFYxMloiIGZpbGw9IiM2QjcyODAiLz4KPHJlY3QgeD0iOCIgeT0iNiIgd2lkdGg9IjIiIGhlaWdodD0iMiIgcng9IjEiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+Cg==";
                      }}
                    />
                    <span className="absolute top-2 left-2 bg-black/50 text-[8px] text-white px-2 py-0.5 rounded font-bold uppercase">
                      Before
                    </span>
                  </div>
                  <div className="w-1/2 relative h-48 bg-muted/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.afterUrl} 
                      alt="After" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.warn("Gallery image failed to load:", item.afterUrl);
                        const img = e.target as HTMLImageElement;
                        img.style.backgroundColor = "#f3f4f6";
                        img.style.display = "flex";
                        img.style.alignItems = "center";
                        img.style.justifyContent = "center";
                        img.style.color = "#6b7280";
                        img.style.fontSize = "10px";
                        img.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMkM4LjQgMiA5IDIuNiA5IDRWMTJDOSA5LjQgOC40IDEwIDggMTBDNy42IDEwIDcgOS40IDcgOFY0QzcgMi42IDcuNiAyIDggMkgxMUM4LjQgMiA5IDIuNiA5IDRWOFYxMloiIGZpbGw9IiM2QjcyODAiLz4KPHJlY3QgeD0iOCIgeT0iNiIgd2lkdGg9IjIiIGhlaWdodD0iMiIgcng9IjEiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+Cg==";
                      }}
                    />
                    <span className="absolute top-2 right-2 bg-primary/80 text-[8px] text-white px-2 py-0.5 rounded font-bold uppercase">
                      After
                    </span>
                  </div>
                </div>

                <div className="flex-[2] p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{item.caption || "Untitled Transformation"}</h3>
                    <p className="text-xs text-muted-foreground mt-1">ID: {item.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
