import { useState, useEffect } from 'react';
import BACKEND_URL from '../../backend_url'; 

interface Driver {

    // From DB
    id:          number
    driverRef:   string | null
    number:      number | null
    code:        string | null
    forename:    string | null
    surname:     string | null
    dob:         string | null
    nationality: string | null
    url:         string | undefined
    // From wiki
    title:       string | null
    description: string | null
    extract:     string | null   
    image:       string | undefined
}

interface Props {
    selectedDriver: number | null
    selectedDriverName: string | null
}

async function fetchDriver(id: number | null, dName: string | null) : Promise<Driver | null> {
    try {
        const res = await fetch(`${BACKEND_URL}/api/driver?id=${Number(id)}&name=${String(dName)}`);
        if (!res.ok) throw new Error("Failed to fetch driver");
        const data: Driver = await res.json();
        return data;
    } catch (err) {
        console.error(`Error fetching driver at id: ${id}`, err);
        return null;
    }
}

export function DriverInfo({ selectedDriver, selectedDriverName }: Props) {
    const [driver, setDriver] = useState<Driver | null>(null);

    useEffect(() => {
        const loadDriver = async () => {
            if (selectedDriver === null) {
                setDriver(null);
                return;
            }
            const fetchedDriver = await fetchDriver(selectedDriver, selectedDriverName);
            // console.log(fetchedDriver);
            setDriver(fetchedDriver);
        };
        loadDriver();
    }, [selectedDriver, selectedDriverName]);

    if (selectedDriver === null) return <p>Select a driver</p>;
    if (!driver) return <p>Loading...</p>;

    let fullname = null;
    let forename = null;
    let surname  = null;

    forename = driver.forename;
    surname  = driver.surname;
    fullname = forename + ' ' + surname;

    const driverData = [
        { header: "Number", value: driver.number },
        { header: "Code", value: driver.code },
        { header: "DOB", 
            value: driver.dob ? new Date(driver.dob).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }) : null,
        },
        { header: "Nationality", value: driver.nationality },
    ].filter(item => item.value != null && item.value !== '');


        return (
            <>
                <div id={String(fullname)} className="gridChildContent driverInfoContent overflow-hidden flex flex-col">
                        <h1 className="">
                            { fullname }
                        </h1>
                        <div className='flex gap-1 min-h-0 flex-1 items-stretch'>
                            <div className="primaryContent border overflow-y-auto">
                                <div className="grid grid-cols-2">
                                    {driverData.map((item) => (
                                        <div className="cells" key={item.header}>
                                            <h3>{item.header}</h3>
                                            <div>{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="cells excerpt">
                                    {/* <h3>{item.header}</h3> */}
                                    <div>{driver.extract}</div>
                                </div>

                                <div className="cells">
                                    <h3>Wiki</h3>
                                    <a href={String(driver.url)} rel="noopener noreferrer" target="_blank">{decodeURIComponent(String(driver.url))}</a>
                                </div>

                            </div>
                            <img className='h-full w-auto object-contain' src={driver.image} alt={fullname}></img>
                        </div>
                </div>
            </>
        );
    }
