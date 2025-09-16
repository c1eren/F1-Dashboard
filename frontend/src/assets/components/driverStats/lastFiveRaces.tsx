import { useState, useEffect } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/table";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface Race {
  raceName: string;
  circuit: number | null;
  date: string | null;
  position: number | null;
  points: number;
  constructor: { name: string };
  fastestLap: number | null;
}

interface DriverLast5RacesProps {
  driverId: number | null;
  driverName: string | null;
}

export function DriverLast5Races({ driverId, driverName }: DriverLast5RacesProps) {
  const [lastRaces, setLastRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!driverId) return;

    const fetchLastRaces = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/api/driver?id=${driverId}`);
        const data: Race[] = await res.json();
        setLastRaces(data);
      } catch (err) {
        console.error("Error fetching last 5 races:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLastRaces();
  }, [driverId]);

  if (!driverId) return <p>Please select a driver.</p>;

  if (loading) return <p>Loading last 5 races...</p>;

  if (lastRaces.length === 0) return <p>No race data found for this driver.</p>;

  return (
    <div>
      {driverName && <h2 className="text-xl font-bold mb-4">{driverName} - Last 5 Races</h2>}
      <Table aria-label="Last Five Races for Driver">
        <TableHeader>
            <TableColumn>Race</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Constructor</TableColumn>
            <TableColumn>Position</TableColumn>
            <TableColumn>Points</TableColumn>
            <TableColumn>Fastest Lap</TableColumn>
        </TableHeader>
        <TableBody>
          {lastRaces.map((race, idx) => (
            <TableRow key={idx}>
              <TableCell>{race.raceName}</TableCell>
              <TableCell>{race.date ? new Date(race.date).toLocaleDateString() : "N/A"}</TableCell>
              <TableCell>{race.constructor?.name ?? "N/A"}</TableCell>
              <TableCell>{race.position ?? "N/A"}</TableCell>
              <TableCell>{race.points}</TableCell>
              <TableCell>{race.fastestLap ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}