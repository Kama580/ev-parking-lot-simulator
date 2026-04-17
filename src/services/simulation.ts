import type { SimulationConfig, SimulationConfigPreview, SimulationResult } from "../types/index.js";

export default class SimulationService {
    private arrivalProbs: Record<number, number> = {
        0: 0.0094, 1: 0.0094, 2: 0.0094, 3: 0.0094, 4: 0.0094, 5: 0.0094,
        6: 0.0094, 7: 0.0094, 8: 0.0283, 9: 0.0283, 10: 0.0566, 11: 0.0566,
        12: 0.0566, 13: 0.0755, 14: 0.0755, 15: 0.0755, 16: 0.1038, 17: 0.1038,
        18: 0.1038, 19: 0.0472, 20: 0.0472, 21: 0.0472, 22: 0.0094, 23: 0.0094
    };

    private demandProbs: Record<number, number> = {
        0: 0.3431, 5: 0.0490, 10: 0.0980, 20: 0.1176, 30: 0.082, 
        50: 0.1176, 100: 0.1078, 200: 0.0490, 300: 0.0294
    };

    private getRandomDistance(): number {
        const entries = Object.entries(this.demandProbs).map(([dist, weight]) => ({
            distance: Number(dist),
            weight: weight
        }));

        const totalWeight = entries.reduce((acc, entry) => acc + entry.weight, 0);
        let randomNum = Math.random() * totalWeight;

        for (const entry of entries) {
            if (randomNum < entry.weight) {
                return entry.distance;
            }
            randomNum -= entry.weight;
        }
        
        return entries[entries.length - 1]?.distance || 0;
    }

    public run(config: SimulationConfig | SimulationConfigPreview): SimulationResult {
        const ticks = 35040;
        const chargers = new Array(config.numChargers).fill(0);
        const maxEnergyPerTick = config.chargerPowerKW / 4;
        
        let totalEnergykWh = 0;
        let actualMaxPowerKW = 0;
        let chargingEvents = 0;

        for (let tick = 0; tick < ticks; tick++) {
            const currentHour = Math.floor(tick / 4) % 24;
            let activeChargerCount = 0;

            for (let i = 0; i < chargers.length; i++) {
                // If the parking spot is busy
                const currentChargerLoad = chargers[i] ?? 0;
                if (currentChargerLoad > 0) {
                    activeChargerCount++;
                    const energyProvided = Math.min(chargers[i], maxEnergyPerTick);
                    chargers[i] -= energyProvided;
                    totalEnergykWh += energyProvided;
                } else {
                    // Decide if a new car arrives now
                    const hourlyProb = (this.arrivalProbs[currentHour] ?? 0) * config.arrivalMultiplier;
                    const tickArrivalProb = hourlyProb / 4;

                    if (Math.random() < tickArrivalProb) {
                        const dist = this.getRandomDistance();
                        if (dist > 0) {
                            chargers[i] = (dist / 100) * config.carConsumption;
                            activeChargerCount++;
                            chargingEvents++;
                        }
                    }
                }
            }

            const currentTickPower = activeChargerCount * config.chargerPowerKW;
            if (currentTickPower > actualMaxPowerKW) actualMaxPowerKW = currentTickPower;
        }

        const theoreticalMaxPower = config.numChargers * config.chargerPowerKW;

        return {
            configId: (config as SimulationConfig).id || "",
            totalEnergykWh: Number(totalEnergykWh.toFixed(2)),
            theoreticalMaxPowerKW: theoreticalMaxPower,
            actualMaxPowerKW,
            concurrencyFactor: Number(((actualMaxPowerKW / theoreticalMaxPower) * 100).toFixed(2)),
            chargingEvents
        };
    }
}