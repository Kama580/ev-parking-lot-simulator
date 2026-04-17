import type { Request, Response } from "express";
import { resultRepo } from "../repositories/index.js";

export async function getResultsByConfigId(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const results = await resultRepo.findByConfigId(id as string);
        res.status(200).json(results);
    } catch (e) {
        console.error("DB Error in getResultsByConfigId:", e);
        res.status(500).json({ error: "Failed to fetch results for this configuration." });
    }
}

export async function getResults(_req: Request, res: Response) {
    try {
        const results = await resultRepo.findAll();
        res.status(200).json(results);
    } catch (e) {
        console.error("DB Error in getResults:", e);
        res.status(500).json({ error: "Internal server error while fetching results." });
    }
}