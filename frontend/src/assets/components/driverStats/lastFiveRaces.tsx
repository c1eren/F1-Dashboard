import { useState, useEffect } from "react";

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
}

export function DriverLast5Races({ driverId }: DriverLast5RacesProps) {
  const [lastRaces, setLastRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!driverId) return;

    const fetchLastRaces = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/driver?id=${driverId}`);
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
    <table style={{ marginTop: "1rem", borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid black", padding: "0.5rem" }}>Race</th>
          <th style={{ border: "1px solid black", padding: "0.5rem" }}>Date</th>
          <th style={{ border: "1px solid black", padding: "0.5rem" }}>Constructor</th>
          <th style={{ border: "1px solid black", padding: "0.5rem" }}>Position</th>
          <th style={{ border: "1px solid black", padding: "0.5rem" }}>Points</th>
          <th style={{ border: "1px solid black", padding: "0.5rem" }}>Fastest Lap</th>
        </tr>
      </thead>
      <tbody>
        {lastRaces.map((race, idx) => (
          <tr key={idx}>
            <td style={{ border: "1px solid black", padding: "0.5rem" }}>{race.raceName}</td>
            <td style={{ border: "1px solid black", padding: "0.5rem" }}>
              {race.date ? new Date(race.date).toLocaleDateString() : "N/A"}
            </td>
            <td style={{ border: "1px solid black", padding: "0.5rem" }}>
              {race.constructor?.name ?? "N/A"}
            </td>
            <td style={{ border: "1px solid black", padding: "0.5rem" }}>
              {race.position ?? "N/A"}
            </td>
            <td style={{ border: "1px solid black", padding: "0.5rem" }}>{race.points}</td>
            <td style={{ border: "1px solid black", padding: "0.5rem" }}>
              {race.fastestLap ? "Yes" : "No"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}