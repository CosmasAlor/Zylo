import prisma from "@/lib/prisma";
import CMSForm from "./cms-form";

export const dynamic = "force-dynamic";

export default async function CMSPage() {
  const blocks = await prisma.contentBlock.findMany();
  const previewUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <main className="container-app py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground mt-2">
          Update the landing page content dynamically. Use visual fields to edit.
        </p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div>
          <CMSForm initialBlocks={blocks.map(b => ({ key: b.key, value: b.value }))} />
        </div>
        
        <div className="hidden lg:block">
          <div className="sticky top-8 space-y-4">
            <h3 className="font-semibold text-sm">Live Preview</h3>
            <div className="overflow-hidden rounded-2xl border bg-background shadow-2xl h-[700px] w-full relative">
              {previewUrl ? (
                <iframe
                  src={`${previewUrl}/`}
                  className="w-full h-full border-none"
                  title="Landing Page Preview"
                  loading="lazy"
                  style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚠️</div>
                    <p className="text-sm">Preview unavailable</p>
                    <p className="text-xs mt-1">NEXT_PUBLIC_APP_URL not set</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Note: Preview reflects the current state of the homepage.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
