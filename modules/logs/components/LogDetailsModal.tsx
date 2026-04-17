"use client";

import { LogEntry } from "@prisma/client";

export function LogDetailsModal({ log, onClose }: { log: LogEntry; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Log Details</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            &times;
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-medium text-muted-foreground">ID</span>
              <span className="text-sm">{log.id}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground">Type</span>
              <span className="text-sm">{log.type}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground">Timestamp</span>
              <span className="text-sm">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground">Route</span>
              <span className="text-sm">{log.route || "-"}</span>
            </div>
          </div>
          
          <div>
            <span className="block text-xs font-medium text-muted-foreground">Message</span>
            <p className="text-sm mt-1 whitespace-pre-wrap">{log.message}</p>
          </div>

          {log.payload && (
            <div>
              <span className="block text-xs font-medium text-muted-foreground">Payload</span>
              <pre className="text-xs bg-secondary p-3 rounded-md mt-1 overflow-x-auto">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </div>
          )}

          {log.stack && (
            <div>
              <span className="block text-xs font-medium text-muted-foreground">Stack Trace</span>
              <pre className="text-xs bg-red-50 text-red-900 border border-red-100 p-3 rounded-md mt-1 overflow-x-auto whitespace-pre-wrap">
                {log.stack}
              </pre>
            </div>
          )}
        </div>
        <div className="p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
