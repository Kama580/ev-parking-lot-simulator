import type { Request, Response } from "express";
import { resultRepo } from "../repositories/index.js";

export async function getResultsByConfigId(req: Request, res: Response) {
    try {
        const configId = req.params.id;
        const results = await resultRepo.findByConfigId(configId as string);
        res.status(200).json(results)
    } catch (e) {
        res.status(400).json({ error: e });
    }
};

export async function getResults(_req: Request, res: Response) {
    try {
        const results = await resultRepo.findAll();
        res.status(200).json(results);
    } catch (e) {
        res.status(400).json({ error: e });
    }
};