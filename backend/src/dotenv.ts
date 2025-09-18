// backend/src/config/dotenv.ts
// Centralised dotenv wrapper
import path from "path";
import dotenv from "dotenv";

const envPath = path.resolve(__dirname, "../../.env.development");
dotenv.config({ path: envPath });

export const PORT = Number(process.env.EXPRESS_BACKEND_PORT) || 3001;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const BACKEND_URL = process.env.VITE_BACKEND_URL!;