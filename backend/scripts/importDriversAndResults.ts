import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = "https://api.jolpi.ca/ergast/f1/";

// Delay helper
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch results for a single race
async function fetchRaceResults(season: number, round: number) {
  const res = await fetch(`${BASE_URL}${season}/${round}/results`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.MRData.RaceTable.Races[0].Results || [];
}

async function importResultsForAllRaces(batchSize = 5, delayMs = 500) {
  const races = await prisma.race.findMany();
  console.log(`Total races: ${races.length}`);

  for (let i = 0; i < races.length; i += batchSize) {
    const batch = races.slice(i, i + batchSize);

    console.log(`Processing races ${i + 1} to ${i + batch.length}...`);

    await Promise.all(
      batch.map(async (race) => {
        try {
          const results = await fetchRaceResults(race.seasonId, race.round);

          for (const result of results) {
            // Upsert Driver
            const driver = await prisma.driver.upsert({
              where: { driverRef: result.Driver.driverId },
              update: {},
              create: {
                driverRef: result.Driver.driverId,
                code: result.Driver.code,
                firstName: result.Driver.givenName,
                lastName: result.Driver.familyName,
                dob: new Date(result.Driver.dateOfBirth),
                nationality: result.Driver.nationality,
                url: result.Driver.url,
              },
            });

            // Upsert Constructor
            const constructor = await prisma.constructor.upsert({
              where: { constructoRef: result.Constructor.constructorId },
              update: {},
              create: {
                constructoRef: result.Constructor.constructorId,
                name: result.Constructor.name,
                nationality: result.Constructor.nationality,
                url: result.Constructor.url,
              },
            });

            // Insert Result
            await prisma.result.create({
              data: {
                raceId: race.id,
                driverId: driver.id,
                constructorId: constructor.id,
                grid: parseInt(result.grid),
                position: result.position ? parseInt(result.position) : null,
                positiontext: result.positionText,
                points: parseFloat(result.points),
                status: result.status,
              },
            });
          }
        } catch (err) {
          console.error(`Failed to fetch results for ${race.name}:`, err);
        }
      })
    );

    // Delay between batches
    await delay(delayMs);
  }

  console.log("All results imported!");
}

importResultsForAllRaces()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());