import { Router } from "express";
import prisma from '../prisma';

const standingsRouter = Router();

standingsRouter.get('/api/standings', async (req, res)=> {
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
            where: {raceId: latestRace.id},
            include: {driver: true}, // Include the driver details
            orderBy: {position: 'asc'}
        });

        return res.json({
            meta: {season: season.year,race:   latestRace.name},
            headers: ["POS", "DRIVER", "NO.", "NATIONALITY", "TEAM", "WINS", "PTS."],
            data: driverStandings.map((ds: typeof driverStandings[number]) => ({
                position: ds.position,
                driver: {
                    id:          ds.driver.id,
                    name:     `${ds.driver.forename} ${ds.driver.surname}`,
                    number:      ds.driver.number,
                    code:        ds.driver.code,
                    nationality: ds.driver.nationality
                },
                points:   ds.points,
                wins:     ds.wins,
            })),
        // return res.json({
        //     season: season.year,
        //     race:   latestRace.name,
        //     standings: driverStandings.map((ds: typeof driverStandings[number]) => ({
        //         position: ds.position,
        //         points:   ds.points,
        //         wins:     ds.wins,
        //         driver: {
        //             id:          ds.driver.id,
        //             name:     `${ds.driver.forename} ${ds.driver.surname}`,
        //             code:        ds.driver.code,
        //             nationality: ds.driver.nationality
        //         },
        //     })),
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Server Error"});
    }
});

export { standingsRouter };


// Get season at year, 
// sort race by desc and take first in list,
//   
/*
        "POS.":        standings?.standings.map(item => item.position ?? '--') ?? [],
        "DRIVER":      standings?.standings.map(item => `${item.driver.forename ?? '--'} ${item.driver.surname ?? '--'}`) ?? [],
        "NO.":         standings?.standings.map(item => item.driver.number ?? '--') ?? [],
        "NATIONALITY": standings?.standings.map(item => item.driver.nationality ?? '--') ?? [],
        "TEAM":        standings?.standings.map(item => item.constructor ?? '--') ?? [],
        "WINS":        standings?.standings.map(item => item.wins ?? '--') ?? [],
        "PTS.":        standings?.standings.map(item => item.points ?? '--') ?? [],
*/