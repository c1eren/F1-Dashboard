import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get latest season from latest race
const latestRace = await prisma.race.findFirst({
    orderBy: {year: 'desc'},
});

const latestYear = latestRace?.year;
if (!latestYear) throw new Error('No races found soz');

// Get drivers who raced in latestYear
const currentDrivers = await prisma.driver.findMany({
    where: {
        results: {
            some: {
                race: {
                    year: latestYear,
                },
            },
        },
    },
});