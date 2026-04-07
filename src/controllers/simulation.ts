import type { Request, Response } from "express";
import  SimulationService from "../services/simulation.js";
import { configRepo, resultRepo } from "../repositories/index.js";

const simService = new SimulationService()

export async function runSimulation(req: Request, res: Response) {
    const config = await configRepo.findById(req.params.id as string);
    if (!config) return res.status(404).json({ error: "Config not found" });

    const results = simService.run(config);

    resultRepo.create(results)

    res.json(results);
};