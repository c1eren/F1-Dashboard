import { useState, useEffect } from 'react';
import BACKEND_URL from '../../backend_url'; 
import './index.css';

function RenderHTML(htmlString : string) {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
}

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
                <div id={String(fullname)} className="gridChildContent flex flex-col h-full min-h-0">
                    <h1 className="">{ fullname }</h1>

                    <div className="flex gap-1 flex-1 min-h-0">
                        {/*  */}
                        <div className='flex flex-col'>
                            <div className="grid grid-cols-2">
                                {driverData.map((item) => (
                                    <div className="cells" key={item.header}>
                                        <h3>{item.header}</h3>
                                        <div>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="excerpt border flex-1 min-h-0 overflow-y-auto">
                                {RenderHTML(String(driver.extract))}
                            </div>
                        </div>
                        <img className='non-responsive-image h-full w-auto object-contain' src={driver.image} alt={fullname}></img>

                    </div>
                            <div className="">
                                <h3>Wiki</h3>
                                <a href={String(driver.url)} rel="noopener noreferrer" target="_blank"><p>{decodeURIComponent(String(driver.url))}</p></a>
                            </div>
                        

                </div>
            </>
        );
    }
