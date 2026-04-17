-- CreateTable
CREATE TABLE "SimulationConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "numChargers" INTEGER NOT NULL,
    "arrivalMultiplier" REAL NOT NULL,
    "carConsumption" REAL NOT NULL,
    "chargerPowerKW" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SimulationResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalEnergykWh" REAL NOT NULL,
    "theoreticalMaxPowerKW" REAL NOT NULL,
    "actualMaxPowerKW" REAL NOT NULL,
    "concurrencyFactor" REAL NOT NULL,
    "chargingEvents" INTEGER NOT NULL,
    "configId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SimulationResult_configId_fkey" FOREIGN KEY ("configId") REFERENCES "SimulationConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
