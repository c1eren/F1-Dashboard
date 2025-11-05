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
    lasdivace:  string
    standings: DriverStanding[]
}

interface StandingsFormatted {
    //Cols
    "POS.":        (number | string | null)[];       
    "DRIVER":      (string | string | null)[];
    "NO.":         (number | string | null)[];
    "NATIONALITY": (string | string | null)[];
    "TEAM":        (string | string | null)[];
    "WINS":        (number | string | null)[];
    "PTS.":        (number | string | null)[];

    [key: string]: (number | string | null)[]; // Index signature
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

//     useEffect(() => {
//   console.log("DriverStandings mounted");
//   return () => console.log("DriverStandings unmounted");
// }, []);
    
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



    const standingsFormatted: StandingsFormatted = {
        // Convert to cols
        "POS.":        standings?.standings.map(item => item.position ?? '--') ?? [],
        "DRIVER":      standings?.standings.map(item => `${item.driver.forename ?? '--'} ${item.driver.surname ?? '--'}`) ?? [],
        "NO.":         standings?.standings.map(item => item.driver.number ?? '--') ?? [],
        "NATIONALITY": standings?.standings.map(item => item.driver.nationality ?? '--') ?? [],
        "TEAM":        standings?.standings.map(item => item.constructor ?? '--') ?? [],
        "WINS":        standings?.standings.map(item => item.wins ?? '--') ?? [],
        "PTS.":        standings?.standings.map(item => item.points ?? '--') ?? [],
    };

    // console.log("standingsFormatted: ",standingsFormatted);

    return (
        <>
        <div className="gridChildContent flex flex-col gap-4 overflow-hidden text-nowrap">
            <div className="flex items-start flex-row">
              <div className="text-2xl font-bold">Driver Standings</div>
              <DatePicker onDateChange={setSelectedYear} startDate={startDate} />
            </div>
            <div id='standingsTable' className='bg-inherit flex flex-col w-full h-full overflow-x-hidden gap-4 '>
                {/* ["POS.", [1, 2, 3, ...]] */}
                <div className='tableHead flex justify-start pb-2 border-b'>
                    {
                        Object.entries(standingsFormatted).map(([colName]) => {
                            return (
                                <div key={colName} className="bg-inherit border w-full p-1">
                                    {}
                                    {colName}
                                </div>
                            );
                        })
                    }
                </div>
                <div className='tableBody flex overflow-y-scroll'>
                    {Object.entries(standingsFormatted).map(([colName, colValues]) => (
                        <div className='w-full' key={colName}>
                            {colValues.map((value, i) => {
                                const driverId = standings?.standings[i]?.driver.id ?? null; // Get ID and fallback to null
                                return (
                                    <div 
                                    className={`border p-1 ${colName === 'DRIVER' ? 'cursor-pointer' : ''}`} 
                                    key={i} 
                                    onClick={colName === 'DRIVER' ? () => {props.onDriverClick(driverId)} : undefined}> {/* Use undefinedfor props apparently */}
                                        {value}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>    
        </div>
        </>
    );
}

/*<div id="tableDiv" className="bg-inherit flex-1 overflow-y-auto overflow-x-hidden w-full">
              <div className="flex flex-col bg-inherit w-full border-collapse">
                    <div className='flex flex-col bg-inherit sticky top-0'>
                        <div className='flex gap-10 font-bold'>
                            <div>POS.       </div>
                            <div>DRIVER     </div>
                            <div>NO.        </div>
                            <div>NATIONALITY</div>
                            <div>TEAM       </div>
                            <div className='-divanslate-x-2'>WINS       </div>
                            <div>PTS.       </div>
                        </div>
                        <div className='border w-full'></div>
                    </div>

                    <div>
                        {standings?.standings.map((s) => (
                            <div className='flex' key={s.driver.id}>
                                <div>{s.position}</div>
                                <div className='cursor-pointer' onClick={() => props.onDriverClick(s.driver.id)}>{s.driver.forename + " " + s.driver.surname}</div>
                                <div><span className='font-semibold'>{s.driver.number}</span></div>
                                <div>{s.driver.nationality}</div>
                                <div>{s.constructor}</div>
                                <div>{s.wins}</div>
                                <div>{s.points}</div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
*/

/*
const mappedData = {
            season: data.season,
            lasdivace: data.lasdivace,
            standings: data.standings.map((s: DriverStanding) => ({
                driver:   s.driver,
                raceId:   s.raceId,
                position: s.position,
                points:   s.points,
                wins:     s.wins,
                consdivuctor: s.consdivuctor
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
        consdivuctor.name,
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
//                         <div><sdivong>{item.header}</sdivong></div>
//                         <div>{item.value}</div>
//                     </div>
//             ))}
//             {driver.url && (
//                 <div className=''>
//                     <div><sdivong>Wiki</sdivong></div>
//                     <div><a href={driver.url} target='_blank'>{driver.url}</a></div>
//                 </div>
//             )}
//         </div>
//     );
// }