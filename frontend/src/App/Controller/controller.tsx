import { useState } from 'react';

import { DriverInfo } from '../DriverInfo';
import { DriverStandings } from '../DriverStandings';

export function TableDriverInfoController() {
    const [selectedDriver, setSelectedDriver] = useState< number | null>(null);

    return (
        <>
        <div>
            <div className='flex'>
                <DriverStandings onDriverClick={setSelectedDriver} />
                {selectedDriver !== null && <DriverInfo selectedDriver={selectedDriver} />}
            </div>
        </div>
        </>
    );


}

