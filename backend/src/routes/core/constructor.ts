import { Router } from "express";
import prisma from '../../prisma';

/*A route is a predefined rule that tells Express: 
“When a request comes in with this HTTP method and 
matches this URL pattern, run this handler function.”*/

const constructorRouter = Router();

constructorRouter.get("/api/constructor", async (req, res) => {
    try {
        const name = req.query.name;
        const idQ = req.query.id;
        const constructorId = idQ ? Number(idQ) : null;
        if (!name && !constructorId) {
            return res.status(400).json({ error: "Missing name and id" });
        }
        
        //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        // DB fallback
        let constructorInfo;
        // Ask prisma (politely) to go get my data
        if (constructorId !== null && !isNaN(constructorId)) 
        {
            constructorInfo = await prisma.constructor.findUnique({
                where: {id: constructorId}
                });
                if (!constructorInfo) {
                    return res.status(404).json({error: `No constructor found for constructor id: ${constructorId} `});
                }
        }
        else
        {
            constructorInfo = await prisma.constructor.findFirst({}); // maybe take:50 or something to limit payload
            // Changed from findMany to findFirst
        }
        // res.json({
        //     source: "DB",
        //     constructorInfo,
        // });
                //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        if (name !== null) {
            try {
                const constructorName = constructorInfo?.url ? 
                decodeURIComponent(
                    new URL(constructorInfo.url).pathname.replace("/wiki/", "")
                )
                : null;
                
                const wikiUrl =
                "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(constructorName ?? "");
            
                const response = await fetch(wikiUrl);
                if (!response.ok) {
                    throw new Error("Wikipedia page not found or fetch failed");
                }
                const data = await response.json();


                if (data && !Array.isArray(constructorInfo)) {
                    const merged = {
                      ...constructorInfo,
                      title: data.title,
                      description: data.description,
                      extract: data.extract_html,
                      image: data.thumbnail?.source || null,
                      wikiUrl: data.content_urls?.desktop?.page || null,
                    };

                    return res.json({
                        ...merged,                        
                    });
                }

            } catch(err : any) {
                // Cop errors on the chin, fallback to DB
                console.warn("Wikipedia fetch failed, falling back to DB:", err.message);
            }
        }

        // DB fallback
        // let constructorInfo;
        // Ask prisma (politely) to go get my data
        if (constructorId !== null && !isNaN(constructorId)) 
        {
            constructorInfo = await prisma.constructor.findUnique({
                where: {id: constructorId}
                });
                if (!constructorInfo) {
                    return res.status(404).json({error: `No constructor found for constructor id: ${constructorId} `});
                }
        }
        else
        {
            constructorInfo = await prisma.constructor.findMany({}); // maybe take:50 or something to limit payload
        }
        res.json({
            source: "DB",
            constructorInfo,
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export {constructorRouter};