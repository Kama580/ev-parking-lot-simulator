export interface SimulationConfig {
    id: string;
    name: string;
    numChargers: number;
    arrivalMultiplier: number;
    carConsumption: number;
    chargerPowerKW: number;
}

export interface SimulationResult {
    id?: string,
    configId: string;
    totalEnergykWh: number;
    theoreticalMaxPowerKW: number;
    actualMaxPowerKW: number;
    concurrencyFactor: number;
    chargingEvents: number;
}