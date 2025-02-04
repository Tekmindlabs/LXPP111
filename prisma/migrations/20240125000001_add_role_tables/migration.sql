-- Create Role and Permission tables
CREATE TABLE "roles" (
	"id" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "permissions" (
	"id" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "role_permissions" (
	"id" TEXT NOT NULL,
	"roleId" TEXT NOT NULL,
	"permissionId" TEXT NOT NULL,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_roles" (
	"id" TEXT NOT NULL,
	"userId" TEXT NOT NULL,
	"roleId" TEXT NOT NULL,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- Add unique constraints
ALTER TABLE "roles" ADD CONSTRAINT "roles_name_key" UNIQUE ("name");
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_name_key" UNIQUE ("name");
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_permissionId_key" UNIQUE ("roleId", "permissionId");
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_roleId_key" UNIQUE ("userId", "roleId");

-- Add foreign key constraints
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;