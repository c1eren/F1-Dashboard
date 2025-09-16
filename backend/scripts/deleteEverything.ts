import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main()
{
    await prisma.circuit.deleteMany({});
    await prisma.constructor.deleteMany({});
    await prisma.constructorResult.deleteMany({});
    await prisma.constructorStanding.deleteMany({});
    await prisma.driver.deleteMany({});
    await prisma.driverStanding.deleteMany({});
    await prisma.lapTime.deleteMany({});
    await prisma.pitStop.deleteMany({});
    await prisma.qualifying.deleteMany({});
    await prisma.race.deleteMany({});
    await prisma.result.deleteMany({});
    await prisma.season.deleteMany({});
    await prisma.sprintResult.deleteMany({});
    await prisma.status.deleteMany({});

    console.log("All tables cleared!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());