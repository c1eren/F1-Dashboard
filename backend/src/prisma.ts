import { PrismaClient } from "@prisma/client";
import {DATABASE_URL} from "./dotenv";

const prisma = new PrismaClient();

export default prisma;