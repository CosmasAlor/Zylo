export const dynamic = "force-dynamic";

import { getPostBySlug } from "@/modules/blog/services/blog";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/sections/navbar";
import { FooterSection } from "@/components/sections/footer-section";
import { getContent } from "@/lib/content";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type BlogPostContent = {
  body?: string;
  text?: string;
  blocks?: Array<{
    type: string;
    text: string;
  }>;
};

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Zylo Dental Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, navbarData, siteData, footerData] = await Promise.all([
    getPostBySlug(slug),
    getContent("navbar"),
    getContent("site"),
    getContent("footer")
  ]);

  if (!post || !post.published) {
    notFound();
  }

  // Basic content processing (handling both block-based and text-based content)
  const content =
    typeof post.content === "object" && post.content !== null && !Array.isArray(post.content)
      ? (post.content as BlogPostContent)
      : null;
  
  let contentElements: React.ReactNode[] = [];
  
  if (content?.blocks && Array.isArray(content.blocks)) {
    // Process block-based content
    contentElements = content.blocks.map((block, i) => {
      if (block.type === "heading") {
        return (
          <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-foreground">
            {block.text}
          </h2>
        );
      }
      return (
        <p key={i} className="text-muted-foreground text-lg leading-loose mb-6">
          {block.text}
        </p>
      );
    });
  } else {
    // Fallback: process text-based content
    const contentText = content?.body || content?.text || "";
    const paragraphs = contentText.split(/\n\n+/).filter(Boolean);
    contentElements = paragraphs.map((para: string, i: number) => (
      <p key={i} className="text-muted-foreground text-lg leading-loose mb-8">
        {para}
      </p>
    ));
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        data={navbarData && typeof navbarData === "object" && !Array.isArray(navbarData) ? navbarData : undefined}
        siteData={siteData && typeof siteData === "object" && !Array.isArray(siteData) ? siteData : undefined}
      />

      <main className="flex-1 pb-24">
        {/* Post Hero */}
        <div className="pt-32 pb-16">
          <div className="container-app px-4 max-w-4xl mx-auto">
            <Link href="/blog">
              <Button variant="ghost" className="gap-2 mb-8 group pl-0 hover:bg-transparent">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Blog
              </Button>
            </Link>
            
            <div className="flex items-center gap-4 text-xs text-primary font-bold uppercase tracking-[0.2em] mb-6">
               <span>Dental Education</span>
               <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
               <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
               <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
               <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> 5 min read</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-8">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed border-l-4 border-primary/20 pl-6 mb-10 italic">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.coverImage && (
          <div className="container-app px-4 max-w-5xl mx-auto mb-20">
            <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <div className="container-app px-4 max-w-3xl mx-auto">
          {/* Article Content */}
          <article className="prose prose-invert prose-lg max-w-none">
            {contentElements}
          </article>

          <div className="mt-20 pt-10 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                 ZY
               </div>
               <div>
                  <p className="text-sm font-bold">Zylo Dental Team</p>
                  <p className="text-xs text-muted-foreground">Modern Care, Local Heart.</p>
               </div>
            </div>
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      <FooterSection
        data={footerData && typeof footerData === "object" && !Array.isArray(footerData) ? footerData : undefined}
        siteData={siteData && typeof siteData === "object" && !Array.isArray(siteData) ? siteData : undefined}
      />
    </div>
  );
}
