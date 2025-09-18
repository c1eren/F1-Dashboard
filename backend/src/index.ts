import express from "express";
import cors from "cors";
import { standingsRouter } from "./routes/standings";
import { driverRouter } from "./routes/driver";
import {PORT} from "./dotenv";

const app = express();

// Enable CORS for dev
app.use(cors({ origin: '*' }));

// Parse JSON
app.use(express.json());

// Mount routes
app.use(standingsRouter);
app.use(driverRouter);

app.get("/", (req, res) => res.send("GET SUCCESS"));
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));