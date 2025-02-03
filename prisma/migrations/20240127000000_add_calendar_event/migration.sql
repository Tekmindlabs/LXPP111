-- CreateTable
CREATE TABLE "calendar_events" (
	"id" TEXT NOT NULL,
	"title" TEXT NOT NULL,
	"description" TEXT,
	"startDate" TIMESTAMP(3) NOT NULL,
	"endDate" TIMESTAMP(3) NOT NULL,
	"level" TEXT NOT NULL,
	"calendarId" TEXT NOT NULL,
	"programId" TEXT,
	"classGroupId" TEXT,
	"classId" TEXT,
	"status" "Status" NOT NULL DEFAULT 'ACTIVE',
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,

	CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);