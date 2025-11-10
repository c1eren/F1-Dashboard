import { Router } from "express";
import { driverStandingsRouter } from "./driverStandings";
import { constructorStandingsRouter } from "./constructorStandings";

const standingsRouter = Router();

standingsRouter.use(driverStandingsRouter);
standingsRouter.use(constructorStandingsRouter);

export {standingsRouter};