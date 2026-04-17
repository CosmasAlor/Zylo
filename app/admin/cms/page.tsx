import prisma from "@/lib/prisma";
import CMSForm from "./cms-form";

export const dynamic = "force-dynamic";

export default async function CMSPage() {
  const blocks = await prisma.contentBlock.findMany();

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
            <div className="overflow-hidden rounded-2xl border bg-background shadow-2xl h-[700px] w-full">
              <iframe 
                src="/" 
                className="w-[1280px] h-[2240px] origin-top-left scale-[0.3125] border-none pointer-events-none" 
                title="Landing Page Preview"
              />
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
