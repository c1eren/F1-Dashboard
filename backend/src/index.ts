import express from "express";
import cors from "cors";

import { driverStandingsRouter } from "./routes/driverStandings";
import { coreRouter } from "./routes/core/coreMaster";

import {PORT} from "./dotenv";

const app = express();

// Enable CORS for dev
app.use(cors({ origin: '*' }));

// Parse JSON
app.use(express.json());

// Mount routes
app.use(driverStandingsRouter);
app.use(coreRouter);

app.get("/", (req, res) => res.send("GET SUCCESS"));
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));