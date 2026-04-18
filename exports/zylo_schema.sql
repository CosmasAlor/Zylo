-- Zylo Database Schema (Tables Only)
-- Exported: 2026-04-18T19:04:37.867Z
-- Use this to create tables in Supabase

CREATE TABLE IF NOT EXISTS "Appointment" (
  "id" text NOT NULL,
  "fullName" text NOT NULL,
  "phone" text NOT NULL,
  "email" text,
  "service" text NOT NULL,
  "preferredDate" timestamp with time zone NOT NULL,
  "preferredTime" text NOT NULL,
  "notes" text,
  "status" USER-DEFINED NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "BlogPost" (
  "id" text NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "content" jsonb NOT NULL,
  "excerpt" text,
  "coverImage" text,
  "published" boolean NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "ContentBlock" (
  "id" text NOT NULL,
  "key" text NOT NULL,
  "value" jsonb NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "GalleryItem" (
  "id" text NOT NULL,
  "beforeUrl" text NOT NULL,
  "afterUrl" text NOT NULL,
  "caption" text,
  "order" integer NOT NULL,
  "createdAt" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "LogEntry" (
  "id" text NOT NULL,
  "type" USER-DEFINED NOT NULL,
  "route" text,
  "message" text NOT NULL,
  "payload" jsonb,
  "stack" text,
  "createdAt" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "MediaItem" (
  "id" text NOT NULL,
  "url" text NOT NULL,
  "filename" text NOT NULL,
  "fileType" text NOT NULL,
  "size" integer NOT NULL,
  "createdAt" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "ModuleConfig" (
  "id" text NOT NULL,
  "name" text NOT NULL,
  "isEnabled" boolean NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id" varchar NOT NULL,
  "checksum" varchar NOT NULL,
  "finished_at" timestamp with time zone,
  "migration_name" varchar NOT NULL,
  "logs" text,
  "rolled_back_at" timestamp with time zone,
  "started_at" timestamp with time zone NOT NULL,
  "applied_steps_count" integer NOT NULL
);

