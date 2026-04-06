import type { SimulationResult } from "../types/index.js";

export class ResultRepository {
    private nextId = 1;

    private storage: Map<string, SimulationResult> = new Map();

    async create(config: SimulationResult) {
        const id = this.nextId.toString();
        this.storage.set(id, {...config, id});
        this.nextId++
        return config;
    }

    async findById(id: string) {
        return this.storage.get(id);
    }

    async findAll() {
        return Array.from(this.storage.values());
    }

    async findByConfigId(configId: string) {
        const results = await this.findAll();
        return results.filter((result) => result.configId === configId)
    }

    async delete(id: string) {
        return this.storage.delete(id);
    }
}