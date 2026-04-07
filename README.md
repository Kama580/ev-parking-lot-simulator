# EV Charging Station Simulator API

This project contains an Express server, which offers a simulation tool designed to help shop owners determine the power demand and energy consumption for electric vehicle (EV) charging points over a one-year period.

## Running

Install dependencies:
   ```bash
      npm install
   ```
Run in development mode with hot-reload using
   ```bash
      npm run dev
   ```
Or start the server with
   ```bash
      npm start
   ```

...Or run  the docker container
   ```bash
      docker compose up
   ```

## API Endpoints
### Configurations
* GET /configs: List all saved simulation configurations.

* POST /configs: Create a new simulation scenario.
    * Body: 
    { 
        "name": string, 
        "numChargers": number, 
        "arrivalMultiplier": number, 
        "carConsumption": number, 
        "chargerPowerKW": number
    }


### Simulation
* POST /configs/:id/simulate: Triggers the simulation engine for a specific configuration.

    Returns: Total energy (kWh), Max Power (kW), and Concurrency Factor (%).

### Results

* GET /results: Return all results which ran to date

* GET /configs/:id/results: Return all results of a particular configuration


## Simulation Logic
* The simulation runs for a full non-leap year (35,040 ticks of 15 minutes).
* Arrival Logic: Uses a probability distribution based on the time of day, adjusted by a user-defined multiplier.
* Consumption Logic: Assigns a random "distance needed" to arriving EVs based on a probability distribution and calculates the required kWh using an 18kWh/100km efficiency (default, adjustable).
* Charging Logic: EVs charge at a maximum of the station's power (defaults to 11kW, adjustable) until their energy needs are met, at which point the charger is freed.

## Project Structure
* src/index: The server and routes are defined here.
* src/services: Contains the core simulation algorithm.
* src/repositories: Data persistence layer (currently In-Memory).
* src/controllers: conrollers for config, result and simulation endpoints.
* src/types: TypeScript interfaces and shared definitions.

## Future Improvements
1. Introduce level-based logging
2. Specify error types and error responses
3. Add unit tests

# Frontend dashboard

Minimal Vite + React + TypeScript + Tailwind frontend visualizing the simulator.

Install

```bash
cd ev-frontend
npm install
```

Development

```bash
npm run dev
```

- Runs the Vite dev server with HMR (default port 5173; it will pick another port if 5173 is busy).

<br />
Build (production)

```bash
npm run build
```

Preview (serve the built app locally)

```bash
npm run preview
```

- `preview` runs `vite preview` which serves the production build from `dist`. By default it serves on port 4173.