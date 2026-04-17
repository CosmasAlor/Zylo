"use client";

import { LogType, LogEntry } from "@prisma/client";
import { useState } from "react";
import { LogDetailsModal } from "./LogDetailsModal";
import { Button } from "@/components/ui/button";

export function LogsTable({ logs }: { logs: LogEntry[] }) {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const getBadgeColor = (type: LogType) => {
    switch (type) {
      case "ERROR": return "bg-red-100 text-red-800 border-red-200";
      case "WARNING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "EVENT": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border mt-4">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/60 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No logs found.
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="border-b border-border hover:bg-secondary/20">
                  <td className="px-4 py-3 font-medium text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(log.type)}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[150px] truncate">
                    {log.route || "-"}
                  </td>
                  <td className="px-4 py-3 max-w-[300px] truncate">
                    {log.message}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                      Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {selectedLog && (
        <LogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </>
  );
}
