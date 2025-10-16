import { Router } from "express";
import prisma from '../../prisma';

/*A route is a predefined rule that tells Express: 
“When a request comes in with this HTTP method and 
matches this URL pattern, run this handler function.”*/

const raceRouter = Router();

raceRouter.get("/api/race", async (req, res) => {
    try {
        const yearReq = req.query.year;
        const nameReq = req.query.name;
        const year = Number(req.query.year);
        const name = nameReq ? String(nameReq) : undefined;
        let raceInfo;

        // Gotta build a dynamic where clause
        const where: any = {};
        if (!isNaN(year)) where.year = year;
        if (name) where.name = { contains: name, mode: "insensitive" };

        if (Object.keys(where).length === 0) {
          return res.status(400).json({
            error: "Please provide at least a valid 'year' or 'name' query parameter.",
          });
        }
       
        raceInfo = await prisma.race.findMany({ where, orderBy: { year: 'desc' } }); // maybe take:50 or something to limit payload
        
            
            res.json(raceInfo);

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal server error"});        
    }
});

export {raceRouter};