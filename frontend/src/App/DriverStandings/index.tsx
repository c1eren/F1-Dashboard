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

interface DriverStanding {
    driver:       Driver
    raceId:       number
    position:     number | null
    points:       number | null
    wins:         number | null
    constructor:  string | null
} 

interface Standings {
    season:    number
    lastRace:  string
    standings: DriverStanding[]
}


async function fetchStandings(season: number | null): Promise<Standings | null> {
    try {
        const res = await fetch(`${BACKEND_URL}/api/driverStandings?id=${Number(season)}`);
        //const res = await fetch(`http://localhost:3001/api/driver?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch driver");

        // This can be written as: "return res.json() as Promise<Driver>;"
        const data: Standings = await res.json();
        return data;

    } catch (err) {
        console.error(`Error fetching season from year: ${season}`, err);
        return null;
    }
}

export function DriverStandings(){
    const [season, setSeason] = useState<Standings| null>(null);
    const [year, _setYear] = useState<number | null>(2022); // Default is 2022 season

    useEffect(() => {
        const loadStandings = async () => {
            if (year === null) {
                setSeason(null);
                return;
            }
            const fetchedStandings = await fetchStandings(year);
            setSeason(fetchedStandings);
        };
        loadStandings();

    }, [year]);

    return (
        <div>
            { season ?
            season.standings[0]?.driver.forename ?? "No standings found"
        : "Loading..."}
        </div>
    );
}

/* 
    Return:
        season,
        points,
        wins,
        driver.number,
        driver.code,
        driver.forename+' '+driver.surname,
        constructor.name,
*/
    

//     if (driverId === null) return <p>Select a driver</p>;
//     if (!driver) return <p>Loading...</p>;

//     const driverData = [
//         {header: "Number", value: driver.number},
//         {header: "Code", value: driver.code},
//         {header: "Name", value: driver.forename + ' ' + driver.surname},
//         {header: "DOB", value: driver.dob},
//         {header: "Nationality", value: driver.nationality},
//     ]

//     return (
//         <div className="max-w-md grid grid-cols-2">
//             {driverData.map((item) => (
//                     <div className="cell" key={item.header}>
//                         <div><strong>{item.header}</strong></div>
//                         <div>{item.value}</div>
//                     </div>
//             ))}
//             {driver.url && (
//                 <div className=''>
//                     <div><strong>Wiki</strong></div>
//                     <div><a href={driver.url} target='_blank'>{driver.url}</a></div>
//                 </div>
//             )}
//         </div>
//     );
// }