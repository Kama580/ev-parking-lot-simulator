import type { Request, Response } from "express";
import { configRepo } from "../repositories/index.js";
import * as z from "zod";

const ConfigSchema = z.object({
    name: z.string().min(1),
    numChargers: z.number().int().min(1),
    arrivalMultiplier: z.number().min(0.2).max(2.0).default(1),
    carConsumption: z.number().default(18),
    chargerPowerKW: z.number().default(11),
});

export async function createConfig(req: Request, res: Response) {
    try {
        const validated = ConfigSchema.parse(req.body);
        const newConfig = await configRepo.create(validated); 
        res.status(201).json(newConfig);
    } catch (e) {
        res.status(400).json({ error: e instanceof Error ? e.message : e });
    }
}

export async function listConfigs(_req: Request, res: Response) {
    try {
        const configs = await configRepo.findAll();
        res.json(configs);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch configurations" });
    }
}

export async function getConfig(req: Request, res: Response) {
    try {
        const { id } = req.params
        const config = await configRepo.findById(id as string);
        if (!config) {
            return res.status(404).json({ error: "Config not found" });
        }
        res.json(config);
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Failed to fetch configurations" });
    }
}