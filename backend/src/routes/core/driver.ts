import { Router } from "express";
import prisma from '../../prisma';

/*A route is a predefined rule that tells Express: 
“When a request comes in with this HTTP method and 
matches this URL pattern, run this handler function.”*/

const driverRouter = Router();

driverRouter.get("/api/driver", async (req, res) => {
    try {
        const idQ = req.query.id;
        const driverId = idQ ? Number(idQ) : null;
        let driverInfo;

        // Ask prisma (politely) to go get my data
        if (driverId !== null && !isNaN(driverId)) {
            driverInfo = await prisma.driver.findMany({
                where: {id: driverId}
                });
            } else {
                driverInfo = await prisma.driver.findMany({}); // maybe take:50 or something to limit payload
            }

        if (driverInfo.length === 0) {
            return res.status(400).json({error: `No results found for driver id: ${driverId} `});
        }

        res.json(driverInfo);

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal server error"});        
    }
});



// Get driver stats


export {driverRouter};