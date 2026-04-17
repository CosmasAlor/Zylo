export const dynamic = "force-dynamic";

import { getPosts } from "@/modules/blog/services/blog";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react";
import { FooterSection } from "@/components/sections/footer-section";
import { Navbar } from "@/components/sections/navbar";
import { getContent } from "@/lib/content";

type BlogListItem = Awaited<ReturnType<typeof getPosts>>[number];

export const metadata = {
  title: "Dental Health Blog | Zylo Dental Clinic",
  description: "Expert advice, clinic news, and dental hygiene tips from the professional team at Zylo Dental Clinic.",
};

export default async function BlogIndexPage() {
  const [posts, navbarData, siteData, footerData] = await Promise.all([
    getPosts(true),
    getContent("navbar"),
    getContent("site"),
    getContent("footer")
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        data={navbarData && typeof navbarData === "object" && !Array.isArray(navbarData) ? navbarData : undefined}
        siteData={siteData && typeof siteData === "object" && !Array.isArray(siteData) ? siteData : undefined}
      />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-muted/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="container-app px-4 relative z-10">
            <div className="max-w-3xl">
              <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-6">
                <Link href="/" className="hover:underline">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <span>Blog</span>
              </nav>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Patient Education & <br />
                <span className="text-primary italic">Clinic Insights.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Stay informed with the latest dental health advice, modern treatment deep-dives, and news from inside Zylo Dental Clinic.
              </p>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-24">
          <div className="container-app px-4">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">New educational content coming soon. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {posts.map((post: BlogListItem) => (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                    <Card className="h-full border-white/10 overflow-hidden bg-card/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        {post.coverImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-30">Zylo Dental</span>
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4">
                           <span className="bg-primary text-white text-[10px] font-bold py-1.5 px-3 rounded-full uppercase tracking-widest shadow-lg">Education</span>
                        </div>
                      </div>
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-medium uppercase tracking-tight">
                          <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> 5 min read</span>
                        </div>
                        <h2 className="text-2xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
                          {post.excerpt || "Discover more about modern dental treatments and how to maintain the perfect smile with the team at Zylo Dental Clinic."}
                        </p>
                        <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                          Read Article <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <FooterSection
        data={footerData && typeof footerData === "object" && !Array.isArray(footerData) ? footerData : undefined}
        siteData={siteData && typeof siteData === "object" && !Array.isArray(siteData) ? siteData : undefined}
      />
    </div>
  );
}
