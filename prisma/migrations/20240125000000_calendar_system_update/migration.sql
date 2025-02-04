-- Create ENUM types
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');
CREATE TYPE "CalendarType" AS ENUM ('PRIMARY', 'SECONDARY', 'EXAM', 'ACTIVITY');
CREATE TYPE "Visibility" AS ENUM ('ALL', 'STAFF', 'STUDENTS', 'PARENTS');
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');
CREATE TYPE "EventType" AS ENUM ('ACADEMIC', 'HOLIDAY', 'EXAM', 'ACTIVITY', 'OTHER');

-- Create tables
CREATE TABLE "calendars" (
	"id" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"startDate" TIMESTAMP(3) NOT NULL,
	"endDate" TIMESTAMP(3) NOT NULL,
	"type" "CalendarType" NOT NULL DEFAULT 'PRIMARY',
	"status" "Status" NOT NULL DEFAULT 'ACTIVE',
	"isDefault" BOOLEAN NOT NULL DEFAULT false,
	"visibility" "Visibility" NOT NULL DEFAULT 'ALL',
	"metadata" JSONB,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "calendars_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "events" (
	"id" TEXT NOT NULL,
	"title" TEXT NOT NULL,
	"description" TEXT,
	"eventType" "EventType" NOT NULL,
	"startDate" TIMESTAMP(3) NOT NULL,
	"endDate" TIMESTAMP(3) NOT NULL,
	"calendarId" TEXT NOT NULL,
	"status" "Status" NOT NULL DEFAULT 'ACTIVE',
	"priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
	"visibility" "Visibility" NOT NULL DEFAULT 'ALL',
	"recurrence" JSONB,
	"metadata" JSONB,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "programs" (
	"id" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"status" "Status" NOT NULL DEFAULT 'ACTIVE',
	"calendarId" TEXT NOT NULL,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "terms" (
	"id" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"calendarId" TEXT NOT NULL,
	"startDate" TIMESTAMP(3) NOT NULL,
	"endDate" TIMESTAMP(3) NOT NULL,
	"status" "Status" NOT NULL DEFAULT 'ACTIVE',
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "terms_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "events" ADD CONSTRAINT "events_calendarId_fkey" 
	FOREIGN KEY ("calendarId") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "programs" ADD CONSTRAINT "programs_calendarId_fkey" 
	FOREIGN KEY ("calendarId") REFERENCES "calendars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "terms" ADD CONSTRAINT "terms_calendarId_fkey" 
	FOREIGN KEY ("calendarId") REFERENCES "calendars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add unique constraints
ALTER TABLE "calendars" ADD CONSTRAINT "calendars_name_type_key" UNIQUE ("name", "type");
ALTER TABLE "programs" ADD CONSTRAINT "programs_name_key" UNIQUE ("name");
ALTER TABLE "terms" ADD CONSTRAINT "terms_name_calendarId_key" UNIQUE ("name", "calendarId");
ALTER TABLE "events" ADD CONSTRAINT "events_title_calendarId_key" UNIQUE ("title", "calendarId");

-- Create indexes
CREATE INDEX "calendars_type_idx" ON "calendars"("type");
CREATE INDEX "calendars_status_idx" ON "calendars"("status");
CREATE INDEX "calendars_isDefault_idx" ON "calendars"("isDefault");
CREATE INDEX "events_calendarId_idx" ON "events"("calendarId");
CREATE INDEX "events_eventType_idx" ON "events"("eventType");
CREATE INDEX "events_status_idx" ON "events"("status");
CREATE INDEX "events_startDate_endDate_idx" ON "events"("startDate", "endDate");