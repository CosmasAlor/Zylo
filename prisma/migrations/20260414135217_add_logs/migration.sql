-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('EVENT', 'ERROR', 'WARNING');

-- CreateTable
CREATE TABLE "LogEntry" (
    "id" TEXT NOT NULL,
    "type" "LogType" NOT NULL,
    "route" TEXT,
    "message" TEXT NOT NULL,
    "payload" JSONB,
    "stack" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogEntry_pkey" PRIMARY KEY ("id")
);
