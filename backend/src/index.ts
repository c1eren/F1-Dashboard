import express from "express";
import cors from "cors";
import { standingsRouter } from "./routes/standings";
import { driverRouter } from "./routes/driver";

import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
console.log("Backend PORT:", process.env.EXPRESS_BACKEND_PORT);
const PORT = process.env.EXPRESS_BACKEND_PORT || 3001;

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

/*#########################################*/
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://frontend:80']
// })); 
// app.use(cors({ origin: "https://my-frontend.com" })); for prod