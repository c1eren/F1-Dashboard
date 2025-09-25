import { Router } from "express";
import prisma from '../../prisma';

/*A route is a predefined rule that tells Express: 
“When a request comes in with this HTTP method and 
matches this URL pattern, run this handler function.”*/

const constructorRouter = Router();

constructorRouter.get("/api/constructor", async (req, res) => {
    try {
        const idQ = req.query.id;
        const constructorId = idQ ? Number(idQ) : null;
        let constructorInfo;

        // Ask prisma (politely) to go get my data
        if (constructorId !== null && !isNaN(constructorId)) {
            constructorInfo = await prisma.constructor.findMany({
                where: {id: constructorId}
                });
            } else {
                constructorInfo = await prisma.constructor.findMany({}); // maybe take:50 or something to limit payload
            }

        if (constructorInfo.length === 0) {
            return res.status(400).json({error: `No results found for constructor id: ${constructorId} `});
        }

        res.json(constructorInfo);

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal server error"});        
    }
});



// Get constructor stats


export {constructorRouter};