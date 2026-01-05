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
        
        //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
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
            driverInfo = await prisma.driver.findFirst({}); // maybe take:50 or something to limit payload
            // Changed from findMany to findFirst
        }
        // res.json({
        //     source: "DB",
        //     driverInfo,
        // });
                //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        if (name !== null) {
            try {
                const driverName = driverInfo?.url ? 
                decodeURIComponent(
                    new URL(driverInfo.url).pathname.replace("/wiki/", "")
                )
                : null;
                
                const wikiUrl =
                "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(driverName ?? "");
            
                const response = await fetch(wikiUrl);
                if (!response.ok) {
                    throw new Error("Wikipedia page not found or fetch failed");
                }
                const data = await response.json();


                if (data && !Array.isArray(driverInfo)) {
                    const merged = {
                      ...driverInfo,
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
        // let driverInfo;
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
        res.json({
            source: "DB",
            driverInfo,
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export {driverRouter};

/*
DB response:
{
  "source": "DB",
  "driverInfo": {
    "id": 1,
    "driverRef": "hamilton",
    "number": 44,
    "code": "HAM",
    "forename": "Lewis",
    "surname": "Hamilton",
    "dob": "1985-01-07T00:00:00.000Z",
    "nationality": "British",
    "url": "http://en.wikipedia.org/wiki/Lewis_Hamilton"
  }
}

WikiAPI response:
{
  "source": "wikipedia",
  "title": "Lewis Hamilton",
  "description": "British racing driver (born 1985)",
  "extract": "Sir Lewis Carl Davidson Hamilton is a British racing driver who competes in Formula One for Ferrari. Hamilton has won a joint-record seven Formula One World Drivers' Championship titles—tied with Michael Schumacher—and holds the records for most wins (105), pole positions (104), and podium finishes (202), among others.",
  "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg/330px-Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg",
  "url": "https://en.wikipedia.org/wiki/Lewis_Hamilton"
}

*/