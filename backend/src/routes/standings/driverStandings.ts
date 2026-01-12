import { Router } from "express";
import prisma from '../../prisma';

const driverStandingsRouter = Router();

driverStandingsRouter.get('/api/driverStandings', async (req, res)=> {
    try {
        const yearQ = req.query.year;
        const yearQuery = yearQ ? Number(yearQ) : null;

        // Get reqested season, or none if none provided
        const season = yearQuery
        ? await prisma.season.findUnique({where: {year: yearQuery}})
        : await prisma.season.findFirst({orderBy: {year: 'desc'}});
        
        if (!season) {
            return res.status(404).json({error: 'No seasons found'});
        }

        const latestRace = await prisma.race.findFirst({
            where: {year: season.year},
            orderBy: {round: 'desc'}
        });

        if (!latestRace) {
            return res.status(404).json({error: 'No races found'});
        }

        // const driverStandings = await prisma.driverStanding.findMany({
        //     where: { raceId: latestRace.id },
        //     include: {
        //         driver: {
        //             include: {
        //                 results: {
        //                     where: { raceId: latestRace.id },
        //                     take: 1,
        //                     // @ts-expect-error
        //                     include: { constructor: { select: { name: true } } }
        //                 }
        //             }
        //         }
        //     },
        //     orderBy: { position: 'asc' }
        // });

         const driverStandings = await prisma.driverStanding.findMany({
            where: { raceId: latestRace.id },
            orderBy: { position: 'asc' },
            include: {driver: true},
        });

        const standingsWithConstructor = await Promise.all(
            driverStandings.map(async (s) => {
                const ds = s.driver;

                //@ts-expect-error
                let constructor = ds.results?.[0]?.constructor ?? null;

                if (!constructor) {
                const prevResult = await prisma.result.findFirst({
                    where: { 
                    driverId: ds.id, 
                    race: { year: season.year, id: { lt: latestRace.id } }
                    },
                    orderBy: { raceId: 'desc' },
                    //@ts-expect-error
                    select: { constructor: { select: { id: true, name: true } } }
                });
                constructor = prevResult?.constructor ?? null;
                }

                const driver = { ...ds };
                delete (driver as any).results;

                return {
                raceId: s.raceId,
                position: s.position,
                points: s.points,
                wins: s.wins,
                driver,
                constructor
                };
            })
            );

            return res.json({
            season: season.year,
            lastRace: latestRace.name,
            standings: standingsWithConstructor,
            });
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Server Error"});
    }
});

export { driverStandingsRouter };

/*
                driver:      ds.driver.map((ds: typeof ds.driver) => ({
                    id:          ds.driver.id,
                    driverRef:   ds.driver.driverRef,
                    number:      ds.driver.number,
                    code:        ds.driver.code,
                    forename:    ds.driver.forename,
                    surname:     ds.driver.surname,
                    dob:         ds.driver.dob,
                    nationality: ds.driver.nationality,
                    url:         ds.driver.url,
                    constructor: ds.driver.constructor,
                    })),
*/



// import { Router } from "express";
// import prisma from '../../prisma';

// const driverStandingsRouter = Router();

// driverStandingsRouter.get('/api/driverStandings', async (req, res)=> {
//     try {
//         const yearQ = req.query.year;
//         const yearQuery = yearQ ? Number(yearQ) : null;

//         // Get reqested season, or none if none provided
//         const season = yearQuery
//         ? await prisma.season.findUnique({where: {year: yearQuery}})
//         : await prisma.season.findFirst({orderBy: {year: 'desc'}});
        
//         if (!season) {
//             return res.status(404).json({error: 'No seasons found'});
//         }

//         const latestRace = await prisma.race.findFirst({
//             where: {year: season.year},
//             orderBy: {round: 'desc'}
//         });

//         if (!latestRace) {
//             return res.status(404).json({error: 'No races found'});
//         }

//         const driverStandings = await prisma.driverStanding.findMany({
//             where: { raceId: latestRace.id },
//             orderBy: { position: 'asc' },
//             include: {driver: true},
//         });
        

//         const standingsWithConstructor = await Promise.all(
//           driverStandings.map(async (ds) => {
//             // Try current race result
//             let aesult = await prisma.result.findFirst({    
//               where: {
//                 driverId: ds.driverId,
//                 raceId: latestRace.id,
//               },
//               select: {
//                 constructor: {
//                     //@ts-expect-error
//                   select: { id: true, name: true },
//                 },
//               },
//             });
        
//             // Fallback to previous races
//             if (!result?.constructor) {
//                 console.log("HERE");
//               result = await prisma.result.findFirst({
//                 where: {
//                   driverId: ds.driverId,
//                   race: {
//                     year: season.year,
//                     id: { lt: latestRace.id },
//                   },
//                 },
//                 orderBy: { raceId: 'desc' },
//                 select: {
//                   constructor: {
//                     //@ts-expect-error
//                     select: { id: true, name: true },
//                   },
//                 },
//               });
//             }
//             console.log(result);
            
//             return {
//               raceId: ds.raceId,
//               position: ds.position,
//               points: ds.points,
//               wins: ds.wins,
//               driver: ds.driver,
//               constructor: result ?? null,
//             };
//           })
//         );

//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({error: "Server Error"});
//     }
// });

// export { driverStandingsRouter };
