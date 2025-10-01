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

interface Props {
    selectedDriver: number | null
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

export function DriverInfo({selectedDriver}: Props){
    const [driver, setDriver] = useState<Driver | null>(null);

    useEffect(() => {
        const loadDriver = async () => {
            if (selectedDriver === null) {
                setDriver(null);
                return;
            }
            const fetchedDriver = await fetchDriver(selectedDriver);
            setDriver(fetchedDriver);
        };
        loadDriver();

    }, [selectedDriver]);

    if (selectedDriver === null) return <p>Select a driver</p>;
    if (!driver) return <p>Loading...</p>;

    const driverData = [
        {header: "Number", value: driver.number},
        {header: "Code", value: driver.code},
        {header: "DOB", value: driver.dob ? new Date(driver.dob).toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric"}) : null},
        {header: "Nationality", value: driver.nationality},
    ]

    return (
        <div className='overflow-x-auto'>
            <div className='border flex flex-col gap-4 p-4'>
            <h1 className="text-2xl font-bold border-b min-w-0 truncate">
                {driver.forename} {driver.surname}
            </h1>
                <div className="w-full max-w-full grid grid-cols-2 gap-4 ">
                    {driverData.map((item) => (
                            <div className="cell" key={item.header}>
                                <div className='min-w-0 truncate'><strong>{item.header}</strong></div>
                                <div className='truncate'>{item.value}</div>
                            </div>
                        ))}
                </div>
                    {driver.url && (
                        <div className=''>
                            <div><strong>Wiki</strong></div>
                            <div className='truncate'><a href={driver.url} target='_blank'>{driver.url}</a></div>
                        </div>
                    )}
            </div>
        </div>
    );
}