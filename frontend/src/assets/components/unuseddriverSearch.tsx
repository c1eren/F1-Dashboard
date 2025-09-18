import { useState, useEffect } from "react";
import BACKEND_URL from "../../backend_url"; 

interface Driver {
  id: number;
  forename: string;
  surname: string;
  code?: string | null;
}

interface DriverSearchProps {
  onSelectDriver: (driverId: number) => void;
}

export function DriverSearch({ onSelectDriver }: DriverSearchProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);

  // Fetch drivers on mount
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/drivers`); // Endpoint
        const data: Driver[] = await res.json();
        setDrivers(data);
      } catch (err) {
        console.error("Error fetching drivers:", err);
      }
    };
    fetchDrivers();
  }, []);

  // Notify parent when a driver is selected
  useEffect(() => {
    if (selectedDriverId !== null) {
      onSelectDriver(selectedDriverId);
    }
  }, [selectedDriverId, onSelectDriver]);

  // Filter drivers by search term
  const filteredDrivers = drivers.filter((d) =>
    `${d.forename} ${d.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search driver by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "0.5rem", width: "250px" }}
      />

      <select
        value={selectedDriverId ?? ""}
        onChange={(e) => setSelectedDriverId(Number(e.target.value))}
      >
        <option value="">-- Select Driver --</option>
        {filteredDrivers.map((d) => (
          <option key={d.id} value={d.id}>
            {d.forename} {d.surname} ({d.code ?? "N/A"})
          </option>
        ))}
      </select>
    </div>
  );
}