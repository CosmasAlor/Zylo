export class DatabaseError extends Error {
  public readonly code: string;
  public readonly cause?: unknown;

  constructor(message: string, options?: { code?: string; cause?: unknown }) {
    super(message);
    this.name = "DatabaseError";
    this.code = options?.code ?? "DB_ERROR";
    this.cause = options?.cause;
  }
}

export function toDatabaseError(
  error: unknown,
  fallbackMessage = "Database operation failed",
) {
  if (error instanceof DatabaseError) {
    return error;
  }

  if (error instanceof Error) {
    return new DatabaseError(error.message || fallbackMessage, {
      code: "DB_RUNTIME_ERROR",
      cause: error,
    });
  }

  return new DatabaseError(fallbackMessage, {
    code: "DB_UNKNOWN_ERROR",
    cause: error,
  });
}
