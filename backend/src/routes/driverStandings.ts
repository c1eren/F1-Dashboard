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
    
        return res.json({
            season: season.year,
            lastRaceThisSeason: latestRace.name,
            standings: driverStandings.map((ds: typeof driverStandings[number]) => ({
                raceId:      ds.raceId,
                position:    ds.position,
                points:      ds.points,
                wins:        ds.wins,
                // @ts-expect-error    
                driver:      ds.driver,
            })),
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Server Error"});
    }
});

export { driverStandingsRouter };