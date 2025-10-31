import { useState } from 'react';

import { DriverInfo } from '../DriverInfo';
import { DriverStandings } from '../DriverStandings';

export function TableDriverInfoController() {
    const [selectedDriver, setSelectedDriver] = useState< number | null>(null);

    return (
        <>
                <div className='gridChild pt-4'>
                    <DriverStandings onDriverClick={setSelectedDriver}/>
                </div>

                <div className='gridChild '>
                    {selectedDriver !== null && <DriverInfo selectedDriver={selectedDriver} />}
                </div>
        </>
    );


}

