"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Edit, Trash2, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  createdAt: string;
  coverImage?: string;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blog");
      const data = await res.json();
      setPosts(data);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch("/api/blog", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("Post deleted");
        setPosts(posts.filter(p => p.id !== id));
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const res = await fetch("/api/blog", {
        method: "PATCH",
        body: JSON.stringify({ id: post.id, published: !post.published }),
      });

      if (res.ok) {
        toast.success(`Post ${!post.published ? "published" : "hidden"}`);
        setPosts(posts.map(p => p.id === post.id ? { ...p, published: !post.published } : p));
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <main className="container-app py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Blog Articles</h1>
          <p className="text-muted-foreground">Write and manage your patient education and clinic news.</p>
        </div>

        <Link href="/admin/blog/new">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            Write New Post
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed">
          <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No posts yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Start by sharing your first clinic update or dental tip.</p>
          <Link href="/admin/blog/new" className="mt-6 inline-block">
            <Button variant="outline">Create Initial Post</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-4 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {post.coverImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Edit className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        {post.published ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                            <Globe className="h-3 w-3" /> Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                            <Lock className="h-3 w-3" /> Draft
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        /{post.slug} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-9 text-xs"
                         onClick={() => togglePublished(post)}
                       >
                         {post.published ? "Unpublish" : "Publish"}
                       </Button>
                       <Link href={`/admin/blog/edit/${post.id}`}>
                         <Button variant="ghost" size="icon" className="h-9 w-9">
                           <Edit className="h-4 w-4" />
                         </Button>
                       </Link>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-9 w-9 text-destructive hover:bg-destructive/10"
                         onClick={() => handleDelete(post.id)}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
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
