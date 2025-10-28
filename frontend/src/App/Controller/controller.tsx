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
            <div className='flex items-start gap-1'>

                <div className='windowAble border pt-4'>
                    <div className='flex items-start flex-row pl-4'>
                        <div className='text-2xl font-bold'>Driver Standings</div>        
                        <DatePicker onDateChange={setSelectedYear} startDate={startDate} />
                    </div>

                    <DriverStandings onDriverClick={setSelectedDriver} selectedYear={selectedYear} />
                </div>

                <div className='windowAble'>
                    {selectedDriver !== null && <DriverInfo selectedDriver={selectedDriver} />}
                </div>
            </div>
        </div>
        </>
    );


}

