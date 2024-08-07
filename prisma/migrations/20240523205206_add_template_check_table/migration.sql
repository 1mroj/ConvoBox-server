-- CreateTable
CREATE TABLE "templateCheck" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "components" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "library_template_name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "previous_category" TEXT NOT NULL,
    "quality_score" TEXT NOT NULL,
    "rejected_reason" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "templateCheck_pkey" PRIMARY KEY ("id")
);
