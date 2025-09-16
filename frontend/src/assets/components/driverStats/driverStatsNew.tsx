import { Card, CardBody } from "@heroui/react";
import { DriverLast5Races } from './lastFiveRaces';

interface Driver {
  id: number;
  name: string;
}

interface DriverStatBoxProps {
    driver: Driver | null;
}

export function DriverStatsBox({ driver }: DriverStatBoxProps) {
  return (
    <Card className="w-auto h-[500px] overflow-y-auto">
      <CardBody className="scrollbar-thin">
        {driver ? (<DriverLast5Races driverId={driver.id} driverName={driver.name} />) // Conditional
        : (<p>Select a driver to see stats</p>)}
      </CardBody>
    </Card>
  );
}