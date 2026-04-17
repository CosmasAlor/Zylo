import { LogType } from "@prisma/client";

export type LogPayload = Record<string, unknown>;

interface LogData {
  type: typeof LogType[keyof typeof LogType];
  route?: string;
  message: string;
  payload?: LogPayload;
  stack?: string;
}

const isClient = typeof window !== "undefined";

const sendLog = async (data: LogData) => {
  if (!isClient) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    try {
      await fetch(`${baseUrl}/api/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error("Failed to send log", e);
    }
    return;
  }

  try {
    fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch(() => {});
  } catch (e) {
    console.error(e);
  }
};

export const logger = {
  logEvent: (message: string, route?: string, payload?: LogPayload) => {
    sendLog({ type: "EVENT", message, route, payload });
  },
  logWarning: (message: string, route?: string, payload?: LogPayload) => {
    sendLog({ type: "WARNING", message, route, payload });
  },
  logError: (message: string, route?: string, payload?: LogPayload, error?: Error | unknown) => {
    let stack;
    if (error instanceof Error) {
      stack = error.stack;
    }
    sendLog({ type: "ERROR", message, route, payload, stack });
  },
  captureClientError: (error: Error, info?: unknown, route?: string) => {
    sendLog({
      type: "ERROR",
      message: error.message || "Client Error",
      route: route || window.location.pathname,
      payload: info as LogPayload | undefined,
      stack: error.stack,
    });
  },
  captureApiError: (error: unknown, route?: string) => {
    const message = error instanceof Error ? error.message : "API Error";
    const stack = error instanceof Error ? error.stack : undefined;
    sendLog({
      type: "ERROR",
      message,
      route,
      stack,
    });
  }
};
