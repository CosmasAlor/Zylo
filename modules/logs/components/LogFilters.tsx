"use client";

import { useTransition, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    const type = formData.get("type") as string;

    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");

    if (type && type !== "ALL") params.set("type", type);
    else params.delete("type");

    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const clearLogs = async () => {
    if (!confirm("Are you sure you want to clear all logs? This cannot be undone.")) return;
    
    try {
      const res = await fetch("/api/logs", { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to clear logs");
      }
    } catch (e) {
      console.error(e);
      alert("Error clearing logs");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <form ref={formRef} onSubmit={onSubmit} className="flex gap-2 flex-grow max-w-xl">
        <input
          name="q"
          placeholder="Search logs..."
          defaultValue={searchParams.get("q") || ""}
          className="flex-grow rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <select
          name="type"
          defaultValue={searchParams.get("type") || "ALL"}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="ALL">All Types</option>
          <option value="EVENT">Events</option>
          <option value="WARNING">Warnings</option>
          <option value="ERROR">Errors</option>
        </select>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Filtering..." : "Filter"}
        </Button>
      </form>
      <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={clearLogs}>
        Clear All Logs
      </Button>
    </div>
  );
}
