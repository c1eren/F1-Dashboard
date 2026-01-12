import { useState, useEffect } from 'react';
import { DatePicker } from '../DatePicker';
import './index.css';

import BACKEND_URL from '../../backend_url'; 

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
    onDriverClick: (driverId: number, driverName: string, type: 'driver' | 'constructor') => void;
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

    const rows = standings?.standings.map(s => ({
      id: s.driver.id,
      url: s.driver.url ?? '--',
      position: s.position ?? '--',
      driver: `${s.driver.forename ?? '--'} ${s.driver.surname ?? '--'}`,
      number: s.driver.number ?? '--',
      nationality: s.driver.nationality ?? '--',
      team: s.constructor ?? '--',
      wins: s.wins ?? '--',
      points: s.points ?? '--',
    })) ?? [];

    // console.log(rows);
    
    const columnNames = [
      { key: "position", value: "POS." },
      { key: "driver", value: "DRIVER" },
      { key: "number", value: "NO." },
      { key: "nationality", value: "NATIONALITY" },
      { key: "team", value: "TEAM" },
      { key: "wins", value: "WINS" },
      { key: "points", value: "PTS." },
    ];
      const columnSize = columnNames.length;
    
      return (
        <>
          <div className='driverStandingsContent'>
    
            <div className="header">
              <h1>Driver Standings</h1>
              <DatePicker onDateChange={setSelectedYear} startDate={startDate} />
            </div>
    
            <div className="standingsTable"
              style={{ gridTemplateColumns: `repeat(${columnSize}, auto)` }}
            >
              <div className='headerRow'>
                {
                    columnNames.map((column) => (
                        <div className='cell' key={column.key}>{column.value}</div>
                    ))
                }
              </div>
              {
                rows && rows.length > 0 ? 
                <div className='content'>
                    {
                        rows.map((row) => (
                            <div className='row' key={row.id}>
                                {
                                    // Map row to column keys for rendering
                                    columnNames.map((col) => (
                                        col.key === "driver" ? 
                                        <div className='cell componentClickableElement' key={`${row.id}-${col.key}`}
                                        onClick={() => {props.onDriverClick(Number(row.id), String(row.driver),"driver")}}>
                                            {row[col.key as keyof typeof row]}
                                        </div>

                                        :<div className='cell' key={`${row.id}-${col.key}`} >{row[col.key as keyof typeof row]}</div>
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>
                : <div className='col-span-full'>Data not found...</div>
                }
              
            </div>
          </div>
        </>
      );
}

    // return (
    //     <>
    //     <div className="gridChildContent driverStandingsContent primaryContent flex flex-col justify-start items-center overflow-hidden text-nowrap">
    //         <div className="flex self-start items-start flex-row">
    //           <h1>Driver Standings</h1>
    //           <DatePicker onDateChange={setSelectedYear} startDate={startDate} />
    //         </div>
    //         <div id='standingsTable' className='standingsTable grid grid-cols-[repeat(7,1fr)] overflow-y-auto'>
    //             {/* ["POS.", [1, 2, 3, ...]] */}
    //             <div className='tableHeaderRow sticky top-0'>POS.       </div>
    //             <div className='tableHeaderRow sticky top-0'>DRIVER     </div>
    //             <div className='tableHeaderRow sticky top-0'>NO.        </div>
    //             <div className='tableHeaderRow sticky top-0'>NATIONALITY</div>
    //             <div className='tableHeaderRow sticky top-0'>TEAM       </div>
    //             <div className='tableHeaderRow sticky top-0'>WINS       </div>
    //             <div className='tableHeaderRow sticky top-0'>PTS.       </div>
    //             {/* Fill in with the rest */}
    //             {Object.entries(standingsFormatted).map(([colName, colValues]) => (
    //                 <div className='columns standingsColumns w-full' key={colName}>
    //                     {colValues.map((value, i) => {
    //                         const driverId = standings?.standings[i]?.driver.id ?? null; // Get ID and fallback to null
    //                         return (
    //                             <div 
    //                             className={`cells ${colName === 'DRIVER' ? 'cursor-pointer' : ''}`} 
    //                             key={i} 
    //                             onClick={colName === 'DRIVER' ? () => {props.onDriverClick(Number(driverId), String(standings?.standings[i]?.driver.forename + '_' + standings?.standings[i]?.driver.surname) )} : undefined}> {/* Use undefinedfor props apparently */}
    //                                 {value}
    //                             </div>
    //                         );
    //                     })}
    //                 </div>
    //             ))}
    //         </div>    
    //     </div>
    //     </>
    // );