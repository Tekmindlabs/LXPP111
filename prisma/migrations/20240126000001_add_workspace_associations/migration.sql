-- Create workspaces table
CREATE TABLE "workspaces" (
	"id" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"status" "Status" NOT NULL DEFAULT 'ACTIVE',
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- Create workspace document associations
CREATE TABLE "workspace_document_associations" (
	"id" TEXT NOT NULL,
	"documentId" TEXT NOT NULL,
	"workspaceId" TEXT NOT NULL,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "workspace_document_associations_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "workspace_document_associations_documentId_fkey" 
		FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "workspace_document_associations_workspaceId_fkey" 
		FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add unique constraint to prevent duplicate associations
CREATE UNIQUE INDEX "workspace_document_associations_documentId_workspaceId_key" 
	ON "workspace_document_associations"("documentId", "workspaceId");

-- Add workspace column to documents table
ALTER TABLE "documents" ADD COLUMN "workspaceId" TEXT;
ALTER TABLE "documents" ADD CONSTRAINT "documents_workspaceId_fkey" 
	FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;