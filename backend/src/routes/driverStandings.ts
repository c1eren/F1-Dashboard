import { Router } from "express";
import prisma from '../prisma';

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

        const driverStandings = await prisma.driverStanding.findMany({
            where: { raceId: latestRace.id },
            include: {
                driver: {
                    include: {
                        results: {
                            where: { raceId: latestRace.id },
                            take: 1,
                            // @ts-expect-error
                            select: { constructor: { select: { name: true } } }
                        }
                    }
                }
            },
            orderBy: { position: 'asc' }
        });

        for (const s of driverStandings)
        {
            // @ts-expect-error
            const ds = s.driver;
            if (!ds.results?.[0]?.constructor.name) {
                const prevResult = await prisma.result.findFirst({
                    where: {
                        driverId: s.driverId,
                        race: { year: Number(yearQuery), id: { lt: latestRace.id} }
                    },
                    orderBy: { raceId: 'desc' },
                    // @ts-expect-error
                    select: { constructor: { select: { name: true } } }
                });
                
                if (prevResult?.constructor) {
                    // @ts-expect-error
                    s.constructor = prevResult.constructor.name;
                    //ds.results = [{ constructor: prevResult.constructor}];
                }
            }
            else {
                s.constructor = ds.results?.[0]?.constructor.name;
            }
        }
            return res.json({
                season: season.year,
                lastRace: latestRace.name,
                standings: driverStandings.map((ds: typeof driverStandings[number]) => {
                    //@ts-expect-error
                    const driver = { ...ds.driver } as any;
                    delete driver.results;

                    return {
                    raceId:      ds.raceId,
                    position:    ds.position,
                    points:      ds.points,
                    wins:        ds.wins,
                    constructor: ds.constructor,
                    driver,
                    };

                }),
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