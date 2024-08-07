-- CreateTable
CREATE TABLE "created_at" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "created_at_pkey" PRIMARY KEY ("id")
);
