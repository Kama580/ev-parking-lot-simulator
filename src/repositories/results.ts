import { prisma } from "../db.js";
import type { SimulationResultUncheckedCreateInput } from "../generated/prisma/models.ts";

export class ResultRepository {
    async create(data: Omit<SimulationResultUncheckedCreateInput, 'id' | 'createdAt'>) {
        return await prisma.simulationResult.create({
            data
        });
    }

    async findById(id: string) {
        return await prisma.simulationResult.findUnique({
            where: { id }
        });
    }

    async findAll() {
        return await prisma.simulationResult.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async findByConfigId(configId: string) {
        return await prisma.simulationResult.findMany({
            where: { configId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async delete(id: string) {
        try {
            await prisma.simulationResult.delete({
                where: { id }
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}