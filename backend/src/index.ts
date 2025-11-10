import express from "express";
import cors from "cors";

import { coreRouter } from "./routes/core/coreMaster";
import { standingsRouter } from "./routes/standings/standingsMaster";

import {PORT} from "./dotenv";

const app = express();

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Enable CORS for dev
app.use(cors({ origin: '*' }));

// Parse JSON
app.use(express.json());

// Mount routes
app.use(coreRouter);
app.use(standingsRouter);

app.get("/", (req, res) => res.send("GET SUCCESS"));
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));