-- Create Knowledge Base tables
CREATE TABLE "knowledge_bases" (
	"id" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "knowledge_bases_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "folders" (
	"id" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT,
	"parentId" TEXT,
	"metadata" JSONB,
	"knowledgeBaseId" TEXT NOT NULL,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "folders_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folders"("id"),
	CONSTRAINT "folders_knowledgeBaseId_fkey" FOREIGN KEY ("knowledgeBaseId") REFERENCES "knowledge_bases"("id")
);

CREATE TABLE "documents" (
	"id" TEXT NOT NULL,
	"title" TEXT NOT NULL,
	"type" TEXT NOT NULL,
	"content" TEXT NOT NULL,
	"embeddings" FLOAT[],
	"metadata" JSONB,
	"folderId" TEXT NOT NULL,
	"knowledgeBaseId" TEXT NOT NULL,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "documents_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "documents_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id"),
	CONSTRAINT "documents_knowledgeBaseId_fkey" FOREIGN KEY ("knowledgeBaseId") REFERENCES "knowledge_bases"("id")
);