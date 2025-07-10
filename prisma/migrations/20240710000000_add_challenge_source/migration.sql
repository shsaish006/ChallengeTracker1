-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "track" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "phases" JSONB,
    "prizes" JSONB,
    "tags" JSONB,
    "skills" JSONB,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "registrationStartDate" TIMESTAMP(3),
    "registrationEndDate" TIMESTAMP(3),
    "submissionStartDate" TIMESTAMP(3),
    "submissionEndDate" TIMESTAMP(3),
    "challengeSource" TEXT,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "legacy" JSONB,
    "timelineTemplateId" TEXT,
    "groups" JSONB,
    "gitRepoURL" TEXT,
    "forumId" TEXT,
    "directProjectId" TEXT,
    "billingAccountId" TEXT,
    "overview" TEXT,
    "reviewType" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_tracks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "challenge_types_name_key" ON "challenge_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_tracks_name_key" ON "challenge_tracks"("name");

-- Insert default challenge types
INSERT INTO "challenge_types" ("id", "name", "description", "isActive", "created", "updated") VALUES
('ct1', 'Code', 'Development challenge', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ct2', 'Design', 'UI/UX Design challenge', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ct3', 'Data Science', 'Data Science and Analytics challenge', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ct4', 'QA', 'Quality Assurance challenge', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert default challenge tracks
INSERT INTO "challenge_tracks" ("id", "name", "description", "isActive", "created", "updated") VALUES
('tr1', 'Development', 'Software Development track', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tr2', 'Design', 'Design track', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tr3', 'Data Science', 'Data Science track', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tr4', 'QA', 'Quality Assurance track', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
