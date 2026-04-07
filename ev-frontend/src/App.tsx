import { useState } from 'react'

type Result = {
  totalEnergykWh: number
  theoreticalMaxPowerKW: number
  actualMaxPowerKW: number
  concurrencyFactor: number
  chargingEvents: number
  hourlyPower: number[]
}

function localSimulate(numChargers: number, arrivalMultiplier: number, carConsumption: number, chargerPowerKW: number): Result {
  const ticks = 35040
  const chargers = new Array(numChargers).fill(0)
  const maxEnergyPerTick = chargerPowerKW / 4

  const arrivalProbs: Record<number, number> = {
    0: 0.0094,1:0.0094,2:0.0094,3:0.0094,4:0.0094,5:0.0094,6:0.0094,7:0.0094,8:0.0283,9:0.0283,10:0.0566,11:0.0566,12:0.0566,13:0.0755,14:0.0755,15:0.0755,16:0.1038,17:0.1038,18:0.1038,19:0.0472,20:0.0472,21:0.0472,22:0.0094,23:0.0094
  }

  const demandProbs: Record<number, number> = {0:0.3431,5:0.0490,10:0.0980,20:0.1176,30:0.082,50:0.1176,100:0.1078,200:0.0490,300:0.0294}

  const demandEntries = Object.entries(demandProbs).map(([d,w])=>({d:Number(d),w}))
  const totalW = demandEntries.reduce((s,e)=>s+e.w,0)
  function pickDistance(){
    let r = Math.random()*totalW
    for(const e of demandEntries){ if(r < e.w) return e.d; r -= e.w }
    return demandEntries[demandEntries.length-1].d
  }

  let totalEnergykWh = 0
  let actualMaxPowerKW = 0
  let chargingEvents = 0
  const hourlyPowerAcc: number[] = new Array(24).fill(0)
  const hourlyCounts: number[] = new Array(24).fill(0)

  for (let tick = 0; tick < ticks; tick++) {
    const currentHour = Math.floor(tick / 4) % 24
    let activeChargerCount = 0

    for (let i = 0; i < chargers.length; i++) {
      if (chargers[i] > 0) {
        activeChargerCount++
        const energyProvided = Math.min(chargers[i], maxEnergyPerTick)
        chargers[i] -= energyProvided
        totalEnergykWh += energyProvided
      } else {
        const hourlyProb = (arrivalProbs[currentHour] ?? 0) * arrivalMultiplier
        const tickArrivalProb = hourlyProb / 4
        if (Math.random() < tickArrivalProb) {
          const dist = pickDistance()
          if (dist > 0) {
            chargers[i] = (dist / 100) * carConsumption
            activeChargerCount++
            chargingEvents++
          }
        }
      }
    }

    const currentTickPower = activeChargerCount * chargerPowerKW
    if (currentTickPower > actualMaxPowerKW) actualMaxPowerKW = currentTickPower
    hourlyPowerAcc[currentHour] += currentTickPower
    hourlyCounts[currentHour]++
  }

  const hourlyPower = hourlyPowerAcc.map((s,i)=> Math.round((s / Math.max(1,hourlyCounts[i]))*100)/100)
  const theoreticalMaxPower = numChargers * chargerPowerKW

  return {
    totalEnergykWh: Number(totalEnergykWh.toFixed(2)),
    theoreticalMaxPowerKW: theoreticalMaxPower,
    actualMaxPowerKW,
    concurrencyFactor: Number(((actualMaxPowerKW / theoreticalMaxPower) * 100).toFixed(2)),
    chargingEvents,
    hourlyPower
  }
}

export default function App(){
  const [numChargers, setNumChargers] = useState(20)
  const [arrivalMultiplier, setArrivalMultiplier] = useState(1)
  const [carConsumption, setCarConsumption] = useState(18)
  const [chargerPowerKW, setChargerPowerKW] = useState(11)
  const [result, setResult] = useState<Result | null>(null)
  const [running, setRunning] = useState(false)

  async function run(){
    setRunning(true)
    await new Promise(r=>setTimeout(r,10))
    const res = localSimulate(numChargers, arrivalMultiplier, carConsumption, chargerPowerKW)
    setResult(res)
    setRunning(false)
  }

  return (
    <div className="min-h-screen p-6 flex items-start justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">EV Charging Station Simulator</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="card">
            <label className="block text-sm font-medium">Number of chargers</label>
            <input type="number" value={numChargers} onChange={e=>setNumChargers(Number(e.target.value))} className="mt-2 w-full border rounded px-2 py-1" />
          </div>

          <div className="card">
            <label className="block text-sm font-medium">Arrival multiplier (0.2–2.0)</label>
            <input type="range" min="0.2" max="2" step="0.05" value={arrivalMultiplier} onChange={e=>setArrivalMultiplier(Number(e.target.value))} className="mt-2 w-full" />
            <div className="text-sm mt-2">{Math.round(arrivalMultiplier*100)}%</div>
          </div>

          <div className="card">
            <label className="block text-sm font-medium">Charger kW / Car consumption (kWh/100km)</label>
            <div className="flex gap-2 mt-2">
              <input type="number" value={chargerPowerKW} onChange={e=>setChargerPowerKW(Number(e.target.value))} className="w-1/2 border rounded px-2 py-1" />
              <input type="number" value={carConsumption} onChange={e=>setCarConsumption(Number(e.target.value))} className="w-1/2 border rounded px-2 py-1" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={run} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={running}>{running ? 'Running…' : 'Run Simulation'}</button>
          <button onClick={()=>{ setResult(null) }} className="px-4 py-2 border rounded">Reset</button>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <h2 className="font-semibold mb-2">Summary</h2>
                <div className="space-y-1 text-sm">
                  <div><strong>Total energy:</strong> {result.totalEnergykWh} kWh</div>
                  <div><strong>Theoretical max:</strong> {result.theoreticalMaxPowerKW} kW</div>
                  <div><strong>Actual peak:</strong> {result.actualMaxPowerKW} kW</div>
                  <div><strong>Concurrency:</strong> {result.concurrencyFactor} %</div>
                  <div><strong>Charging events:</strong> {result.chargingEvents}</div>
                </div>
              </div>
            </div>

            <div className="card mt-4">
              <h2 className="font-semibold mb-2">Exemplary day — average hourly power</h2>
              <div className="w-full overflow-x-auto">
                <div className="flex items-end gap-2 h-48">
                  {result.hourlyPower.map((v,i) => {
                    const pct = result.theoreticalMaxPowerKW > 0 ? (v / result.theoreticalMaxPowerKW) * 100 : 0;
                    return (
                      <div key={i} style={{width: `${100/24}%`, minWidth: 28}} className="flex flex-col items-center">
                        <div className="w-full flex items-end h-36 bg-gray-100 rounded overflow-hidden" title={`${v} kW`}>
                          <div style={{height: `${pct}%`}} className="w-full bg-blue-500"></div>
                        </div>
                        <div className="text-xs mt-1">{i}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
