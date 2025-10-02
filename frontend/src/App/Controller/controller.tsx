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
            <DatePicker onDateChange={setSelectedYear} startDate={startDate} />
            <div className='flex'>
                <DriverStandings onDriverClick={setSelectedDriver} selectedYear={selectedYear} />
                {selectedDriver !== null && <DriverInfo selectedDriver={selectedDriver} />}
            </div>
        </div>
        </>
    );


}

