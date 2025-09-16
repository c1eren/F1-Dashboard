-- CreateTable
CREATE TABLE "public"."Season" (
    "year" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "public"."Race" (
    "id" SERIAL NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "circuit" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "url" TEXT NOT NULL,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Driver" (
    "id" SERIAL NOT NULL,
    "driverRef" TEXT NOT NULL,
    "code" TEXT,
    "number" INTEGER,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Constructor" (
    "id" SERIAL NOT NULL,
    "constructoRef" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Constructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Result" (
    "id" SERIAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "constructorId" INTEGER NOT NULL,
    "grid" INTEGER NOT NULL,
    "position" INTEGER,
    "positiontext" TEXT NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_driverRef_key" ON "public"."Driver"("driverRef");

-- CreateIndex
CREATE UNIQUE INDEX "Constructor_constructoRef_key" ON "public"."Constructor"("constructoRef");

-- AddForeignKey
ALTER TABLE "public"."Race" ADD CONSTRAINT "Race_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."Season"("year") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "public"."Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "public"."Constructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
