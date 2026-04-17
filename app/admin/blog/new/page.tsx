"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
  });

  const generateSlug = () => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setPost({ ...post, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post.title || !post.slug || !post.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/blog", {
        method: "POST",
        body: JSON.stringify({
          ...post,
          content: { type: "markdown", text: post.content }, // Wrapped for future expansion
        }),
      });

      if (res.ok) {
        toast.success("Post created successfully");
        router.push("/admin/blog");
      } else {
        toast.error("Failed to create post");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-app py-10 px-4">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
          <p className="text-muted-foreground">Draft your next masterpiece for the Zylo blog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
              <CardDescription>Main body of your blog post.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input 
                  id="title"
                  value={post.title}
                  onChange={e => setPost({...post, title: e.target.value})}
                  onBlur={generateSlug}
                  placeholder="e.g., 5 Tips for a Brighter Smile"
                  className="text-lg font-semibold h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug (automatically generated)</Label>
                <div className="flex items-center gap-2">
                   <span className="text-xs text-muted-foreground">zylo.com/blog/</span>
                   <Input 
                    id="slug"
                    value={post.slug}
                    onChange={e => setPost({...post, slug: e.target.value})}
                    placeholder="5-tips-brighter-smile"
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Post Body (Markdown Support)</Label>
                <Textarea 
                  id="content"
                  value={post.content}
                  onChange={e => setPost({...post, content: e.target.value})}
                  placeholder="Write your article here..."
                  className="min-h-[400px] font-serif text-lg leading-relaxed resize-y"
                />
                <p className="text-[10px] text-muted-foreground">Supporting standard Markdown formatting.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Settings & Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="coverImage"
                    value={post.coverImage}
                    onChange={e => setPost({...post, coverImage: e.target.value})}
                    placeholder="/uploads/my-image.jpg"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">Get URLs from the Media Library tab.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt / Summary</Label>
                <Textarea 
                  id="excerpt"
                  value={post.excerpt}
                  onChange={e => setPost({...post, excerpt: e.target.value})}
                  placeholder="A short summary for the preview card..."
                  className="h-24 text-sm"
                />
              </div>

              <div className="pt-6 flex flex-col gap-3">
                 <Button type="submit" className="w-full gap-2" disabled={loading}>
                   {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                   Save and Continue
                 </Button>
                 <Button 
                   type="button" 
                   variant="secondary" 
                   className="w-full gap-2"
                   onClick={() => setPost({...post, published: !post.published})}
                 >
                   <Sparkles className="h-4 w-4" />
                   {post.published ? "Set as Draft" : "Mark as Public"}
                 </Button>
              </div>
            </CardContent>
          </Card>
          
          {post.coverImage && (
            <Card className="overflow-hidden border-white/10">
              <CardHeader className="py-3 px-4 bg-muted/30">
                 <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Cover Preview</CardTitle>
              </CardHeader>
              <div className="aspect-video relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.coverImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </Card>
          )}
        </div>
      </form>
    </main>
  );
}
