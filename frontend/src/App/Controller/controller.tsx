import { useState } from 'react';

import { DriverInfo } from '../DriverInfo';
import { DriverStandings } from '../DriverStandings';
import { DatePicker } from '../DatePicker';

const startDate = new Date("2024"); // Until we get current standings


export function TableDriverInfoController() {
    const [selectedDriver, setSelectedDriver] = useState< number | null>(null);
    const [selectedYear, setSelectedYear] = useState<Date | null>(startDate);

    return (
        <>
        <div>
            <div className='flex'>
                <div className='border pt-4'>
                    <h1 className='flex pl-4'><DatePicker onDateChange={setSelectedYear} startDate={startDate} />
                        Driver Standings
                    </h1>

                    <DriverStandings onDriverClick={setSelectedDriver} selectedYear={selectedYear} />
                </div>
                {selectedDriver !== null && <DriverInfo selectedDriver={selectedDriver} />}
            </div>
        </div>
        </>
    );


}

