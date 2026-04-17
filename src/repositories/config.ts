import { prisma } from "../db.js"; 
import type { SimulationConfigUncheckedCreateInput, SimulationConfigUpdateInput } from "../generated/prisma/models.js";

export class ConfigRepository {
    async create(data: Omit<SimulationConfigUncheckedCreateInput, 'id' | 'createdAt'>) {
        return await prisma.simulationConfig.create({
            data
        });
    }

    async findById(id: string) {
        return await prisma.simulationConfig.findUnique({
            where: { id }
        });
    }

    async findAll() {
        return await prisma.simulationConfig.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async delete(id: string) {
        try {
            await prisma.simulationConfig.delete({
                where: { id }
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async update(id: string, updates: SimulationConfigUpdateInput) {
        return await prisma.simulationConfig.update({
            where: { id },
            data: updates
        });
    }
}