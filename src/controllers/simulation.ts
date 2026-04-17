import type { Request, Response } from "express";
import SimulationService from "../services/simulation.js";
import { configRepo, resultRepo } from "../repositories/index.js";

const simService = new SimulationService();

export async function runSimulation(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const config = await configRepo.findById(id as string);
        
        if (!config) {
            return res.status(404).json({ error: "Configuration not found" });
        }

        const results = simService.run(config);

        const savedResult = await resultRepo.create({
            ...results
        });

        res.json(savedResult);
    } catch (e) {
        console.error("Simulation Error:", e);
        res.status(500).json({ error: "An error occurred during the simulation run." });
    }
}