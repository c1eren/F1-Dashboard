import { Router } from "express";
import prisma from '../prisma';

const driverRouter = Router();

// Lets get a driver and return their stats
driverRouter.get("/api/driver", async (req, res) => {
    try {
        const driverId = Number(req.query.id);
        if (!driverId) {
            return res.status(400).json({error: "Driver Id is required"});
        }

        // Fetch the last 5 seasons's's's results
        const results = await prisma.result.findMany({
            where: { driverId },
            orderBy: {race: {date: 'desc'}},
            take: 5,
            include: {race:true, constructor: true} // Bring in race info too
        });

        // Get sprint results too
        const sprintResults = await prisma.sprintResult.findMany({
            where: { driverId },
            orderBy: {race: {date: 'desc'}},
            take: 5,
            include: {race:true, constructor: true}
        });

        if (results.length === 0 && sprintResults.length === 0) {
            return res.status(404).json({error: "No results found for this driver"})
        }

        // Merge em (spread)
        const combined = [...results, ...sprintResults].sort((a, b) => {
            const dateA = a.race.date ? new Date(a.race.date).getTime() : 0;
            const dateB = b.race.date ? new Date(b.race.date).getTime() : 0;
            return dateB - dateA;
        });

        const lastFive = combined.slice(0,5);

        if (lastFive.length === 0) {
            return res.status(404).json({error: "No races found for driver"});
        }

        // Formatting 
        const response = lastFive.map((r: typeof lastFive[number]) => ({
            raceName: r.race?.name ?? "Unknown",
            circuit: r.race?.circuitId ?? null,
            date: r.race?.date ?? null,
            position: r.position,
            points: r.points,
            constructor: r.constructor ?? null,
            fastestLap: r.fastestLap
        }));
        
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"}); // Internal server error
    }
});

export {driverRouter};