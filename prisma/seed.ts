import { prisma } from "../src/db.js";

async function main() {
  console.log("🌱 Starting seeding...");

  await prisma.simulationResult.deleteMany();
  await prisma.simulationConfig.deleteMany();

  const officeConfig = await prisma.simulationConfig.create({
    data: {
      name: "Berlin HQ Office",
      numChargers: 10,
      arrivalMultiplier: 1.0,
      carConsumption: 18.0,
      chargerPowerKW: 11.0,
    },
  });

  const fastChargeConfig = await prisma.simulationConfig.create({
    data: {
      name: "Highway Fast Charging Hub",
      numChargers: 4,
      arrivalMultiplier: 1.8,
      carConsumption: 22.0,
      chargerPowerKW: 50.0,
    },
  });


  console.log(`✅ Seeding complete!`);
  console.log(`Created Configs: ${officeConfig.name}, ${fastChargeConfig.name}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });