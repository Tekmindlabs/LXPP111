-- Add coordinatorId column to programs table
ALTER TABLE "programs" ADD COLUMN "coordinatorId" TEXT;

-- Add foreign key constraint for coordinatorId
ALTER TABLE "programs" ADD CONSTRAINT "programs_coordinatorId_fkey" 
	FOREIGN KEY ("coordinatorId") REFERENCES "coordinator_profiles"("id") 
	ON DELETE SET NULL ON UPDATE CASCADE;