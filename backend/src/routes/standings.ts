import { Router } from "express";
import prisma from '../prisma';

const standingsRouter = Router();

standingsRouter.get('/api/currentDriverStandings', async (req, res)=> {
    try {
        let yearQuery;
        if (req.query.year) {
            yearQuery = Number(req.query.year); // Turn into number
        } else {
            yearQuery = undefined; // Leave undefined
        }

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
            where: {raceId: latestRace.id},
            include: {driver: true}, // Include the driver details
            orderBy: {position: 'asc'}
        });

        return res.json({
            season: season.year,
            race:   latestRace.name,
            standings: driverStandings.map((ds: typeof driverStandings[number]) => ({
                position: ds.position,
                points:   ds.points,
                wins:     ds.wins,
                driver: {
                    id:          ds.driver.id,
                    name:     `${ds.driver.forename} ${ds.driver.surname}`,
                    code:        ds.driver.code,
                    nationality: ds.driver.nationality
                },
            })),
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Server Error"});
    }
});

export { standingsRouter };