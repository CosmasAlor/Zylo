"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Check, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface GalleryItem {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  caption: string | null;
  order: number;
}

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery");
      const data = await res.json();

      if (!res.ok) {
        toast.error("Failed to load gallery");
        console.error("Gallery API error", res.status, data);
        return;
      }

      if (!Array.isArray(data)) {
        toast.error("Failed to load gallery");
        console.error("Unexpected gallery payload", data);
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

  const handleCreate = async () => {
    if (!editingItem?.beforeUrl || !editingItem?.afterUrl) {
      toast.error("Both Before and After images are required");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/gallery", {
        method: "POST",
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        toast.success("Gallery item added");
        setEditingItem(null);
        fetchItems();
      } else {
        toast.error("Failed to add item");
      }
    } catch {
      toast.error("An error occurred");
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
        setItems(items.filter(i => i.id !== id));
      }
    } catch {
      toast.error("Failed to delete");
    }
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
            <CardTitle>New Transformation</CardTitle>
            <CardDescription>Enter image URLs (from Media Library) and a caption.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Before Image URL</Label>
                <div className="flex gap-2">
                  <Input 
                    value={editingItem.beforeUrl || ""} 
                    onChange={e => setEditingItem({...editingItem, beforeUrl: e.target.value})}
                    placeholder="/uploads/before.jpg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>After Image URL</Label>
                <Input 
                  value={editingItem.afterUrl || ""} 
                  onChange={e => setEditingItem({...editingItem, afterUrl: e.target.value})}
                  placeholder="/uploads/after.jpg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Caption / Case Description</Label>
              <Input 
                value={editingItem.caption || ""} 
                onChange={e => setEditingItem({...editingItem, caption: e.target.value})}
                placeholder="e.g., Full Mouth Rehabilitation"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
               <Button variant="ghost" onClick={() => setEditingItem(null)} disabled={saving}>Cancel</Button>
               <Button onClick={handleCreate} disabled={saving}>
                 {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                 Save Transformation
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
              <CardContent className="p-0 flex flex-col md:flex-row h-full md:h-40">
                <div className="flex flex-1">
                  <div className="w-1/2 relative h-40 md:h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.beforeUrl} alt="Before" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-black/50 text-[8px] text-white px-2 py-0.5 rounded font-bold uppercase">Before</span>
                  </div>
                  <div className="w-1/2 relative h-40 md:h-full border-l border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.afterUrl} alt="After" className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-primary/80 text-[8px] text-white px-2 py-0.5 rounded font-bold uppercase">After</span>
                  </div>
                </div>
                
                <div className="flex-[2] p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{item.caption || "Untiled Transformation"}</h3>
                    <p className="text-xs text-muted-foreground mt-1">ID: {item.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
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
