import express from "express";
import { createConfig, getConfig, getConfigResults, listConfigs } from "./controllers/config.js";
import { getResults, getResultsByConfigId } from "./controllers/result.js";
import { runSimulation } from "./controllers/simulation.js";

const app = express();
app.use(express.json());

app.get("/configs", listConfigs);
app.get("/configs/:id", getConfig);
app.post("/configs", createConfig);
app.post("/configs/:id/simulation", runSimulation);
app.get("/configs/:id/results", getResultsByConfigId);
app.get("/configs/:id/configresults", getConfigResults)
app.get("/results", getResults);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});