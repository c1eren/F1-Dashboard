import { useState } from "react";
import { DriverSearch } from "./driverSearch";
import { DriverLast5Races } from "./lastFiveRaces";

export function DriverStatsPage() {
  const [driverId, setDriverId] = useState<number | null>(null);

  return (
    <div>
      <h1>Driver Last 5 Races</h1>
      <DriverSearch onSelectDriver={setDriverId} />
      <DriverLast5Races driverId={driverId} />
    </div>
  );
}