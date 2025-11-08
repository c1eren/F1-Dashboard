import { useState, useEffect } from 'react';
import BACKEND_URL from '../../backend_url'; 

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
        if (!res.ok) throw new Error("Failed to fetch driver");
        const data: Driver = await res.json();
        return data;
    } catch (err) {
        console.error(`Error fetching driver at id: ${id}`, err);
        return null;
    }
}

export function DriverInfo({ selectedDriver }: Props) {
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
        { header: "Number", value: driver.number },
        { header: "Code", value: driver.code },
        {
            header: "DOB",
            value: driver.dob
                ? new Date(driver.dob).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                  })
                : null,
        },
        { header: "Nationality", value: driver.nationality },
        { header: "Wiki", value: driver.url}
    ];

    return (
        <>
            <div className="gridChildContent driverInfoContent overflow-hidden ">
                    <h1 className="">
                        {driver.forename} {driver.surname}
                    </h1>
                    <div className="primaryContent">
                        <div className="grid grid-cols-2">
                            {driverData.map((item) => (
                                    item.header === "Wiki" && item.value ? (
                                        <div className="cells col-span-2" key={item.header}>
                                            <h3>{item.header}</h3>
                                            <a href={String(item.value)} rel="noopener noreferrer" target="_blank">{item.value}</a>
                                        </div>
                                    ) : (
                                        <div className="cells" key={item.header}>
                                            <h3>{item.header}</h3>
                                            <div>{item.value}</div>
                                        </div>
                                    )
                            ))}
                        {/* {driver.url && (
                            <div>
                                <h3>Wiki</h3>
                                <a href={driver.url} target="_blank">{driver.url}</a>
                            </div>
                        )} */}
                        </div>
                    </div>
            </div>
        </>
    );
}
