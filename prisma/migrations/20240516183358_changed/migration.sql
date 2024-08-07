-- CreateTable
CREATE TABLE "templates" (
    "template_id" TEXT NOT NULL,
    "wabaid" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("template_id")
);
