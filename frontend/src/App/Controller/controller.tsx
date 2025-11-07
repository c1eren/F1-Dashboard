import { useState } from 'react';
import { DriverInfo } from '../DriverInfo';
import { DriverStandings } from '../DriverStandings';
import './TableDriverInfoController.css';

export function TableDriverInfoController() {
    const [selectedDriver, setSelectedDriver] = useState<number | null>(null);

    return (
        <>
            <div id='driverStandingsComponent' className='gridChild driverStandings'>
                <DriverStandings onDriverClick={setSelectedDriver} />
            </div>

            {/* Conditionally render the driver info window */}
            {/* Can be some issues with grab rendering (and probably other stuff too) */}
            {selectedDriver && (
                <div id='driverInfoComponent' className="gridChild driverInfo min-w-[350px] min-h-[250px] fade-in-scale">
                    <DriverInfo selectedDriver={selectedDriver} />
                </div>
            )}
        </>
    );
}
