import fs from 'fs/promises';
import path from 'path';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db/prisma";
import { ModuleToggle } from "./ModuleToggle";

export async function ModulesList() {
  const modulesDir = path.join(process.cwd(), 'modules');
  let modules: string[] = [];

  try {
    const entries = await fs.readdir(modulesDir, { withFileTypes: true });
    modules = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch (error) {
    console.error("Failed to read modules directory", error);
  }

  // Fetch module statuses from DB
  const configs = await db.moduleConfig.findMany();
  const configMap = new Map<string, boolean>(configs.map((c: { name: string; isEnabled: boolean }) => [c.name, c.isEnabled]));

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Installed Modules</h2>
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          {modules.length} Installed
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {modules.map((mod) => {
          // Default to true if not found in db, or read db stat
          const isActive: boolean = configMap.has(mod) ? configMap.get(mod) ?? true : true;
          
          return (
            <Card key={mod} className={`transition-all bg-card ${!isActive ? 'opacity-60 grayscale-[0.5]' : 'shadow-sm hover:border-primary/50'}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize text-lg">{mod}</CardTitle>
                  <ModuleToggle name={mod} initialIsActive={isActive} />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">System module loaded from /modules/{mod}</CardDescription>
                <div className="mt-4 flex justify-between items-center">
                  {isActive ? (
                    <span className="text-[10px] text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Operational
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Disabled
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground font-mono">v1.0.0</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
