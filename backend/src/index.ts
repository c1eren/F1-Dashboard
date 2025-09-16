import express from "express";
import cors from "cors";
import { standingsRouter } from "./routes/standings";
import { driverRouter } from "./routes/driver";

const app    = express();
// Enable CORS for dev
app.use(cors()); // app.use(cors({ origin: "https://my-frontend.com" })); for prod
// Parse JSON
app.use(express.json());
// Mount routes
app.use(standingsRouter);
app.use(driverRouter);

const PORT = 3000;
app.get("/", (req, res) => res.send("Hello F1 Website!"));
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));