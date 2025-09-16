import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BASE_URL = "https://api.jolpi.ca/ergast/f1/";
const PAGE_LIMIT = 30;

// Fetch all races for a season, handling pagination
async function fetchSeasonRaces(year: string) {
  let offset = 0;
  let allRaces: any[] = [];
  let totalRaces = 0;

  do {
    const res = await fetch(`${BASE_URL}${year}?limit=${PAGE_LIMIT}&offset=${offset}`);
    const data = await res.json();

    const races = data.MRData.RaceTable.Races || [];
    totalRaces = parseInt(data.MRData.total || "0", 10);

    allRaces = allRaces.concat(races);
    offset += PAGE_LIMIT;
  } while (allRaces.length < totalRaces);

  return allRaces;
}

async function importSeason(year: string) {
  console.log(`Importing season ${year}...`);
  const races = await fetchSeasonRaces(year);

  // Convert to number
  const yearInt = parseInt(year, 10);

  // Upsert season
  const season = await prisma.season.upsert({
    where: { year: yearInt },
    update: {},
    create: { year: yearInt, url: `${BASE_URL}${year}/` },
  });

  for (const race of races) {
    console.log(`Importing race ${race.raceName} (round ${race.round})...`);

    // Insert race
    const raceRecord = await prisma.race.create({
      data: {
        seasonId: season.year,
        round: parseInt(race.round, 10),
        name: race.raceName,
        circuit: race.Circuit.circuitName,
        date: new Date(race.date),
        time: race.time || null,
        url: race.url,
      },
    });

    // Insert results if available
    if (Array.isArray(race.Results)) {
      for (const result of race.Results) {
        // Upsert Driver
        const driver = await prisma.driver.upsert({
          where: { driverRef: result.Driver.driverId },
          update: {},
          create: {
            driverRef: result.Driver.driverId,
            code: result.Driver.code || null,
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
            raceId: raceRecord.id,
            driverId: driver.id,
            constructorId: constructor.id,
            grid: parseInt(result.grid || "0", 10),
            position: result.position ? parseInt(result.position, 10) : null,
            positiontext: result.positionText,
            points: parseFloat(result.points || "0"),
            status: result.status,
          },
        });
      }
    }
  }

  console.log(`Season ${year} imported (${races.length} races).`);
}

async function main() {
  const START_YEAR = 1990;
  const END_YEAR = new Date().getFullYear();

  for (let year = START_YEAR; year <= END_YEAR; year++) {
    try {
      await importSeason(year.toString()); // Pass year as string
    } catch (err) {
      console.error(`Failed to import season ${year}:`, err);
    }
  }

  console.log("All seasons imported successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());