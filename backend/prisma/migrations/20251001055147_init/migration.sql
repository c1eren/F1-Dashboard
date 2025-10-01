/*
  Warnings:

  - You are about to drop the column `constructoRef` on the `Constructor` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `circuit` on the `Race` table. All the data in the column will be lost.
  - You are about to drop the column `seasonId` on the `Race` table. All the data in the column will be lost.
  - You are about to drop the column `positiontext` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Result` table. All the data in the column will be lost.
  - Added the required column `constructorRef` to the `Constructor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forename` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `circuitId` to the `Race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `laps` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionOrder` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionText` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Race" DROP CONSTRAINT "Race_seasonId_fkey";

-- DropIndex
DROP INDEX "public"."Constructor_constructoRef_key";

-- DropIndex
DROP INDEX "public"."Driver_driverRef_key";

-- AlterTable
ALTER TABLE "public"."Constructor" DROP COLUMN "constructoRef",
ADD COLUMN     "constructorRef" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Constructor_id_seq";

-- AlterTable
ALTER TABLE "public"."Driver" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "forename" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "dob" DROP NOT NULL;
DROP SEQUENCE "Driver_id_seq";

-- AlterTable
ALTER TABLE "public"."Race" DROP COLUMN "circuit",
DROP COLUMN "seasonId",
ADD COLUMN     "circuitId" INTEGER NOT NULL,
ADD COLUMN     "fp1_date" TIMESTAMP(3),
ADD COLUMN     "fp1_time" TEXT,
ADD COLUMN     "fp2_date" TIMESTAMP(3),
ADD COLUMN     "fp2_time" TEXT,
ADD COLUMN     "fp3_date" TIMESTAMP(3),
ADD COLUMN     "fp3_time" TEXT,
ADD COLUMN     "quali_date" TIMESTAMP(3),
ADD COLUMN     "quali_time" TEXT,
ADD COLUMN     "sprint_date" TIMESTAMP(3),
ADD COLUMN     "sprint_time" TEXT,
ADD COLUMN     "year" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "date" DROP NOT NULL;
DROP SEQUENCE "Race_id_seq";

-- AlterTable
ALTER TABLE "public"."Result" DROP COLUMN "positiontext",
DROP COLUMN "status",
ADD COLUMN     "fastestLap" INTEGER,
ADD COLUMN     "fastestLapSpeed" TEXT,
ADD COLUMN     "fastestLapTime" TEXT,
ADD COLUMN     "laps" INTEGER NOT NULL,
ADD COLUMN     "milliseconds" INTEGER,
ADD COLUMN     "number" INTEGER,
ADD COLUMN     "positionOrder" INTEGER NOT NULL,
ADD COLUMN     "positionText" TEXT NOT NULL,
ADD COLUMN     "rank" INTEGER,
ADD COLUMN     "statusId" INTEGER NOT NULL,
ADD COLUMN     "time" TEXT,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Result_id_seq";

-- CreateTable
CREATE TABLE "public"."Circuit" (
    "id" INTEGER NOT NULL,
    "circuitRef" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "alt" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Circuit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Qualifying" (
    "id" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "constructorId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "q1" TEXT,
    "q2" TEXT,
    "q3" TEXT,

    CONSTRAINT "Qualifying_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Status" (
    "id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConstructorResult" (
    "id" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "constructorId" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "status" TEXT,

    CONSTRAINT "ConstructorResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConstructorStanding" (
    "id" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "constructorId" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "position" INTEGER NOT NULL,
    "positionText" TEXT NOT NULL,
    "wins" INTEGER NOT NULL,

    CONSTRAINT "ConstructorStanding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DriverStanding" (
    "id" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "position" INTEGER NOT NULL,
    "positionText" TEXT NOT NULL,
    "wins" INTEGER NOT NULL,

    CONSTRAINT "DriverStanding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SprintResult" (
    "id" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "constructorId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "grid" INTEGER NOT NULL,
    "position" INTEGER,
    "positionText" TEXT NOT NULL,
    "positionOrder" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "laps" INTEGER NOT NULL,
    "time" TEXT,
    "milliseconds" INTEGER,
    "fastestLap" INTEGER,
    "fastestLapTime" TEXT,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "SprintResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LapTime" (
    "raceId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "lap" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "milliseconds" INTEGER NOT NULL,

    CONSTRAINT "LapTime_pkey" PRIMARY KEY ("raceId","driverId","lap")
);

-- CreateTable
CREATE TABLE "public"."PitStop" (
    "raceId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "stop" INTEGER NOT NULL,
    "lap" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "milliseconds" INTEGER NOT NULL,

    CONSTRAINT "PitStop_pkey" PRIMARY KEY ("raceId","driverId","stop")
);

-- AddForeignKey
ALTER TABLE "public"."Race" ADD CONSTRAINT "Race_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "public"."Circuit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Race" ADD CONSTRAINT "Race_year_fkey" FOREIGN KEY ("year") REFERENCES "public"."Season"("year") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Qualifying" ADD CONSTRAINT "Qualifying_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "public"."Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Qualifying" ADD CONSTRAINT "Qualifying_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Qualifying" ADD CONSTRAINT "Qualifying_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "public"."Constructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConstructorResult" ADD CONSTRAINT "ConstructorResult_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "public"."Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConstructorResult" ADD CONSTRAINT "ConstructorResult_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "public"."Constructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConstructorStanding" ADD CONSTRAINT "ConstructorStanding_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "public"."Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConstructorStanding" ADD CONSTRAINT "ConstructorStanding_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "public"."Constructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DriverStanding" ADD CONSTRAINT "DriverStanding_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "public"."Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DriverStanding" ADD CONSTRAINT "DriverStanding_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SprintResult" ADD CONSTRAINT "SprintResult_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "public"."Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SprintResult" ADD CONSTRAINT "SprintResult_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SprintResult" ADD CONSTRAINT "SprintResult_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "public"."Constructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SprintResult" ADD CONSTRAINT "SprintResult_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LapTime" ADD CONSTRAINT "LapTime_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "public"."Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LapTime" ADD CONSTRAINT "LapTime_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PitStop" ADD CONSTRAINT "PitStop_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "public"."Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PitStop" ADD CONSTRAINT "PitStop_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
