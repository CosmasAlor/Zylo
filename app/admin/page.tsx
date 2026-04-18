import { db } from "@/lib/db/prisma";
import { LogType, LogEntry, Prisma } from "@prisma/client";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LogsTable } from "@/modules/logs/components/LogsTable";
import { LogFilters } from "@/modules/logs/components/LogFilters";

import { ModulesList } from "@/modules/admin/components/ModulesList";

type AdminDashboardProps = {
  searchParams: Promise<{
    q?: string;
    type?: LogType | "ALL";
    page?: string;
  }>;
};

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const type = params.type && params.type !== "ALL" ? params.type : undefined;
  const page = parseInt(params.page || "1");
  const limit = 50;
  const skip = (page - 1) * limit;

  const where: Prisma.LogEntryWhereInput = {};
  if (type) {
    where.type = type as LogType;
  }
  if (q) {
    where.OR = [
      { message: { contains: q, mode: 'insensitive' } },
      { route: { contains: q, mode: 'insensitive' } },
    ];
  }

  // Get Today's Date start
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  let logs: LogEntry[] = [];
  let totalFiltered = 0;
  let stats: number[] = [0, 0, 0, 0];

  try {
    const results = await Promise.all([
      db.logEntry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      db.logEntry.count({ where }),
      Promise.all([
        db.logEntry.count(),
        db.logEntry.count({ where: { type: "ERROR" } }),
        db.logEntry.count({ where: { type: "EVENT" } }),
        db.logEntry.count({ where: { type: "ERROR", createdAt: { gte: startOfToday } } }),
      ])
    ]);
    logs = results[0];
    totalFiltered = results[1];
    stats = results[2];
  } catch (error) {
    console.error("Database connection error in admin dashboard:", error);
    // Fallback to empty data
  }

  const [totalLogs, totalErrors, totalEvents, errorsToday] = stats;

  return (
    <main className="container-app py-8">
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Platform Operations</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your system modules, network events, and application vitals.
        </p>
      </div>

      <ModulesList />

      <div className="flex flex-col mb-4 mt-8">
        <h2 className="text-xl font-semibold tracking-tight">System Activity Logs</h2>
      </div>

      <section className="grid gap-4 md:grid-cols-4 mb-8">
        <Card spacing="md">
          <CardDescription>Total Logs</CardDescription>
          <CardTitle className="mt-1 text-3xl">{totalLogs}</CardTitle>
        </Card>
        <Card spacing="md">
          <CardDescription>Total Events</CardDescription>
          <CardTitle className="mt-1 text-3xl">{totalEvents}</CardTitle>
        </Card>
        <Card spacing="md">
          <CardDescription>Total Errors</CardDescription>
          <CardTitle className="mt-1 text-3xl text-red-600">{totalErrors}</CardTitle>
        </Card>
        <Card spacing="md">
          <CardDescription>Errors Today</CardDescription>
          <CardTitle className="mt-1 text-3xl text-orange-600">{errorsToday}</CardTitle>
        </Card>
      </section>

      <section className="bg-card rounded-xl border border-border p-4 shadow-sm">
        <LogFilters />
        <LogsTable logs={logs} />
        
        {totalFiltered > limit && (
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground px-2">
            <span>Showing {skip + 1} to {Math.min(skip + limit, totalFiltered)} of {totalFiltered} entries</span>
            <div className="flex gap-2">
              {page > 1 && (
                <a href={`?page=${page - 1}${q ? `&q=${q}` : ''}${type ? `&type=${type}` : ''}`} className="px-3 py-1 border rounded bg-secondary hover:bg-secondary/80 text-foreground">
                  Previous
                </a>
              )}
              {skip + limit < totalFiltered && (
                <a href={`?page=${page + 1}${q ? `&q=${q}` : ''}${type ? `&type=${type}` : ''}`} className="px-3 py-1 border rounded bg-secondary hover:bg-secondary/80 text-foreground">
                  Next
                </a>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
