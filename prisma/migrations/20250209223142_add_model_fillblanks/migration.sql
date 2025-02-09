/*
  Warnings:

  - A unique constraint covering the columns `[lessonNumber]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "FillBlanks" (
    "id" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "greek" TEXT NOT NULL,
    "pool" TEXT[],
    "correct" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "FillBlanks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_lessonNumber_key" ON "Lesson"("lessonNumber");

-- AddForeignKey
ALTER TABLE "FillBlanks" ADD CONSTRAINT "FillBlanks_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
