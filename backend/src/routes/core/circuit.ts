import { Router } from "express";
import prisma from '../../prisma';

/*A route is a predefined rule that tells Express: 
“When a request comes in with this HTTP method and 
matches this URL pattern, run this handler function.”*/

const circuitRouter = Router();

circuitRouter.get("/api/circuit", async (req, res) => {
    try {
        const idQ = req.query.id;
        const circuitId = idQ ? Number(idQ) : null;
        let circuitInfo;

        // Ask prisma (politely) to go get my data
        if (circuitId !== null && !isNaN(circuitId)) {
            circuitInfo = await prisma.circuit.findMany({
                where: {id: circuitId}
                });
            } else {
                circuitInfo = await prisma.circuit.findMany({}); // maybe take:50 or something to limit payload
            }

        if (circuitInfo.length === 0) {
            return res.status(400).json({error: `No results found for circuit id: ${circuitId} `});
        }

        res.json(circuitInfo);

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal server error"});        
    }
});



// Get circuit stats


export {circuitRouter};