import { useState, useEffect } from 'react';
import { DatePicker } from '../DatePicker';

import BACKEND_URL from '../../backend_url'; 
import './index.css'

const startDate = new Date("2024"); // Until we get current standings

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
    raceId:       number
    position:     number | null
    points:       number | null
    wins:         number | null
    constructor:  string | null
    driver:       Driver
} 

interface Standings {
    season:    number
    lastRace:  string
    standings: DriverStanding[]
}

interface Props {
    //This means: “Parent must give me a function that accepts a number and returns nothing (void).”
    onDriverClick: (driverId: number | null) => void;
}


async function fetchStandings(season: number): Promise<Standings | null> {
    try {
        const res = await fetch(`${BACKEND_URL}/api/driverStandings?year=${season}`);
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

export function DriverStandings(props: Props){
    const [standings, setStandings] = useState<Standings| null>(null);
    const [selectedYear, setSelectedYear] = useState<Date | null>(startDate);
    
    useEffect(() => {
        const loadStandings = async () => {
            if (selectedYear === null) {
                setStandings(null);
                return;
            }
            const fetchedStandings = await fetchStandings(Number(selectedYear?.getFullYear()));
            setStandings(fetchedStandings);
        };
        loadStandings();

    }, [selectedYear]);

    return (
        <>
        <div className="gridChildContent flex flex-col">
            <div className="flex items-start flex-row pl-4">
              <div className="text-2xl font-bold">Driver Standings</div>
              <DatePicker onDateChange={setSelectedYear} startDate={startDate} />
            </div>

            <div id="tableDiv" className="bg-inherit flex-1 overflow-y-auto overflow-x-hidden w-full">
              <table className="bg-inherit w-full border-collapse">
                    <thead className='bg-inherit sticky top-0 border-b'>
                        <tr>
                            <th>POS.       </th>
                            <th>DRIVER     </th>
                            <th>NO.        </th>
                            <th>NATIONALITY</th>
                            <th>TEAM       </th>
                            <th className='-translate-x-2'>WINS       </th>
                            <th>PTS.       </th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings?.standings.map((s) => (
                            <tr key={s.driver.id}>
                                <td>{s.position}</td>
                                <td className='cursor-pointer' onClick={() => props.onDriverClick(s.driver.id)}>{s.driver.forename + " " + s.driver.surname}</td>
                                <td><span className='font-semibold'>{s.driver.number}</span></td>
                                <td>{s.driver.nationality}</td>
                                <td>{s.constructor}</td>
                                <td>{s.wins}</td>
                                <td>{s.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}

/*
const mappedData = {
            season: data.season,
            lastRace: data.lastRace,
            standings: data.standings.map((s: DriverStanding) => ({
                driver:   s.driver,
                raceId:   s.raceId,
                position: s.position,
                points:   s.points,
                wins:     s.wins,
                constructor: s.constructor
            }))
        };
*/

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