-- Create User type enum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'COORDINATOR', 'TEACHER', 'STUDENT', 'PARENT');

-- Create User table
CREATE TABLE "users" (
	"id" TEXT NOT NULL,
	"name" TEXT,
	"email" TEXT,
	"emailVerified" TIMESTAMP(3),
	"image" TEXT,
	"password" TEXT,
	"status" "Status" NOT NULL DEFAULT 'ACTIVE',
	"userType" "UserType",
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	"deleted" TIMESTAMP(3),
	"dataRetentionDate" TIMESTAMP(3),
	CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "users_email_key" UNIQUE ("email")
);

-- Update user_roles foreign key
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" 
	FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;