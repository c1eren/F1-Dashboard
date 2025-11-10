import { Router } from "express";
import prisma from '../../prisma';

const constructorStandingsRouter = Router();

constructorStandingsRouter.get('/api/constructorStandings', async (req, res)=> {
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

        const constructorStandings = await prisma.constructorStanding.findMany({
            where: { raceId: latestRace.id },
            include: {
                constructor: true
            },
            orderBy: { position: 'asc' },
        });

        return (res.json({
            season: season.year,
            lastRace: latestRace.name,
            standings:
                constructorStandings
            }));

    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Server Error"});
    }
});

export { constructorStandingsRouter };