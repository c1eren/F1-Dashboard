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
        <>
        <div className='gridChildContent overflow-y-auto overflow-x-hidden h-full'>
            <div className='w-full h-full flex flex-col gap-4 p-4'>
            <h1 className="min-h-12 text-2xl font-bold border-b ">
                {driver.forename} {driver.surname}
            </h1>
            <div className=' w-full h-full'>
                <div className="grid grid-cols-2 gap-4 ">
                    {driverData.map((item) => (
                            <div className="cell" key={item.header}>
                                <div className='min-w-0 '><strong>{item.header}</strong></div>
                                <div className=''>{item.value}</div>
                            </div>
                        ))}
                </div>
                    { driver.url && (
                        <div className=''>
                            <div><strong>Wiki</strong></div>
                            <div className=''><a href={driver.url} target='_blank'>{driver.url}</a></div>
                        </div>
                    )}
            </div>
                {/* <div className='cursor-pointer' onClick={() => props.onDriverClick(s.driver.id)}>
                    more TODO
                </div> */}
            </div>
        </div>
        </>
    );
}