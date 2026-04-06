import express from "express";
import { createConfig, listConfigs } from "./controllers/config.js";
import { getResults, getResultsByConfigId } from "./controllers/result.js";
import { runSimulation } from "./controllers/simulation.js";

const app = express();
app.use(express.json());

app.post("/configs", createConfig);
app.get("/configs", listConfigs);
app.post("/configs/:id/simulate", runSimulation);
app.get("/configs/:id/results", getResultsByConfigId)
app.get("/results", getResults)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});