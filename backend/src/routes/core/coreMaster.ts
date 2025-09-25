import { Router } from "express";
import { driverRouter } from "./driver";
import { constructorRouter } from "./constructor";
import { circuitRouter } from "./circuit";

const coreRouter = Router();

coreRouter.use(driverRouter);
coreRouter.use(constructorRouter);
coreRouter.use(circuitRouter);

export {coreRouter};