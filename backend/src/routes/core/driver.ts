import { Router } from "express";
import prisma from '../../prisma';

/*A route is a predefined rule that tells Express: 
“When a request comes in with this HTTP method and 
matches this URL pattern, run this handler function.”*/

const driverRouter = Router();

driverRouter.get("/api/driver", async (req, res) => {
    try {
        const name = req.query.name;
        const idQ = req.query.id;
        const driverId = idQ ? Number(idQ) : null;
        if (!name && !driverId) {
            return res.status(400).json({ error: "Missing name and id" });
        }
        
        if (name !== null) {
            try {
                const wikiUrl =
                  "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(String(name));
            
                const response = await fetch(wikiUrl);
                if (!response.ok) {
                    throw new Error("Wikipedia page not found or fetch failed");
                }
                const data = await response.json();
            
                if (data.type !== "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") {
                    return res.json({
                        source: "wikipedia",
                        title:       data.title,
                        description: data.description,
                        extract:     data.extract,
                        image:       data.thumbnail?.source || null,
                        url:         data.content_urls?.desktop?.page || null,
                    });
                }

            } catch(err : any) {
                // Cop errors on the chin, fallback to DB
                console.warn("Wikipedia fetch failed, falling back to DB:", err.message);
            }
        }

        // DB fallback
        let driverInfo;
        // Ask prisma (politely) to go get my data
        if (driverId !== null && !isNaN(driverId)) 
        {
            driverInfo = await prisma.driver.findUnique({
                where: {id: driverId}
                });
                if (!driverInfo) {
                    return res.status(404).json({error: `No driver found for driver id: ${driverId} `});
                }
        }
        else
        {
            driverInfo = await prisma.driver.findMany({}); // maybe take:50 or something to limit payload
        }
        res.json(driverInfo);

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export {driverRouter};