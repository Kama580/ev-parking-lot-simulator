import type { Request, Response } from "express";
import { configRepo } from "../repositories/index.js";
import * as z from "zod"

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
        const newConfig = await configRepo.create({ ...validated, id: Date.now().toString() });
        res.status(201).json(newConfig);
    } catch (e) {
        res.status(400).json({ error: e });
    }
};

export async function listConfigs(_req: Request, res: Response) {
    res.json(await configRepo.findAll());
};