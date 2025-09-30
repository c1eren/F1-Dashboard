import { useState, useEffect } from 'react';
import BACKEND_URL from '../../backend_url'; 
import './index.css'

interface Driver {
    id:          number
    driverRef:   string | null
    number:      number | null
    code:        string | null
    forename:    string | null
    surname:     string | null
    dob:         string | null
    nationality: string | null
    url:         string | undefined
}

async function fetchDriver(id: number | null): Promise<Driver | null> {
    try {
        const res = await fetch(`${BACKEND_URL}/api/driver?id=${Number(id)}`);
        //const res = await fetch(`http://localhost:3001/api/driver?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch driver");

        // This can be written as: "return res.json() as Promise<Driver>;"
        const data: Driver = await res.json();
        return data;

    } catch (err) {
        console.error(`Error fetching driver at id: ${id}`, err);
        return null;
    }
}

export function DriverInfo(){
    const [driver, setDriver] = useState<Driver | null>(null);
    const [driverId, _setDriverId] = useState<number | null>(1); // Default, lewis hamilton

    useEffect(() => {
        const loadDriver = async () => {
            if (driverId === null) {
                setDriver(null);
                return;
            }
            const fetchedDriver = await fetchDriver(driverId);
            setDriver(fetchedDriver);
        };
        loadDriver();

    }, [driverId]);

    if (driverId === null) return <p>Select a driver</p>;
    if (!driver) return <p>Loading...</p>;

    const driverData = [
        {header: "Number", value: driver.number},
        {header: "Code", value: driver.code},
        {header: "Name", value: driver.forename + ' ' + driver.surname},
        {header: "DOB", value: driver.dob},
        {header: "Nationality", value: driver.nationality},
    ]

    return (
        <div className="max-w-md grid grid-cols-2">
            {driverData.map((item) => (
                    <div className="cell" key={item.header}>
                        <div><strong>{item.header}</strong></div>
                        <div>{item.value}</div>
                    </div>
            ))}
            {driver.url && (
                <div className=''>
                    <div><strong>Wiki</strong></div>
                    <div><a href={driver.url} target='_blank'>{driver.url}</a></div>
                </div>
            )}
        </div>
    );
}