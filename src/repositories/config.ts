import type { SimulationConfig } from "../types/index.js";

export class ConfigRepository {
    private storage: Map<string, SimulationConfig> = new Map();

    async create(config: SimulationConfig) {
        this.storage.set(config.id, config);
        return config;
    }

    async findById(id: string) {
        return this.storage.get(id);
    }

    async findAll() {
        return Array.from(this.storage.values());
    }

    async delete(id: string) {
        return this.storage.delete(id);
    }

    async update(id: string, updates: Partial<SimulationConfig>) {
        const existing = this.storage.get(id);
        if (!existing) return null;
        const updated = { ...existing, ...updates };
        this.storage.set(id, updated);
        return updated;
    }
}