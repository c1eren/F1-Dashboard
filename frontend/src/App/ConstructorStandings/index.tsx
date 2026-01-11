import { useState, useEffect } from 'react';
import { DatePicker } from '../DatePicker';
// import './index.css';

import BACKEND_URL from '../../backend_url'; 

const startDate = new Date("2024"); // Until we get current standings

interface Constructor {
    id:             number
    constructorRef: string | null
    name:           string | null
    nationality:    string | null
    url:            string | undefined
}

interface ConstructorStanding {
    raceId:       number
    position:     number | null
    points:       number | null
    wins:         number | null
    constructor:  Constructor
} 

interface Standings {
    season:    number
    lastRace:  string
    standings: ConstructorStanding[]
}

interface StandingsFormatted {
    //Cols
    "POS.":        (number | string | null)[];       
    "CONSTRUCTOR": (string | string | null)[];
    "NATIONALITY": (string | string | null)[];
    "WINS":        (number | string | null)[];
    "PTS.":        (number | string | null)[];

    [key: string]: (number | string | null)[]; // Index signature
}

interface Props {
    //This means: “Parent must give me a function that accepts a number and returns nothing (void).”
    onConstructorClick: (constructorId: number, constructorName: string) => void;
}


async function fetchStandings(season: number): Promise<Standings | null> {
    try {
        const res = await fetch(`${BACKEND_URL}/api/constructorStandings?year=${season}`);
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

export function ConstructorStandings(props: Props){
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

    // console.log(standings);

    const rows = standings?.standings.map(s => ([
      s.points ?? '--',
      s.constructor.name ?? '--',
      s.constructor.nationality ?? '--',
      s.wins ?? '--',
      s.points ?? '--'
    ])) ?? [];

    const standingsFormatted: StandingsFormatted = {
        // Convert to cols
        "POS.":        standings?.standings.map(item => item.position                ?? '--')   ?? [],
        "CONSTRUCTOR": standings?.standings.map(item => `${item.constructor.name     ?? '--'}`) ?? [],
        "NATIONALITY": standings?.standings.map(item => item.constructor.nationality ?? '--')   ?? [],
        "WINS":        standings?.standings.map(item => item.wins                    ?? '--')   ?? [],
        "PTS.":        standings?.standings.map(item => item.points                  ?? '--')   ?? [],

    };
    const columnSize = Object.keys(standingsFormatted).length;

    return (
    <>
    
    <div className='h-full'>
      <div className="header">
        <h1>Constructor Standings</h1>
        <DatePicker onDateChange={setSelectedYear} startDate={startDate} />
      </div>

      <div
        className="grid w-full h-full darkTest border-2 border-black"
        style={{ 
          gridTemplateColumns: `repeat(${columnSize}, auto)`,
          gridTemplateRows: 'auto 1fr'
       }}
      >
        <div className='grid baseTest py-2 col-span-full grid-cols-subgrid w-full'>
        {Object.entries(standingsFormatted).map(([colName]) => (
            <div className="" key={colName}>
              {colName}
            </div>
          ))}
        </div>
        
        <div
        className='self-start grid col-span-full grid-cols-subgrid w-full overflow-y-scroll h-full'
        >
          {
            rows.map((row, rowIndex) => {
              return (
                row.map((cell, colIndex) => {
                  return (
                    <div key={`${rowIndex}-${colIndex}`}>{cell}</div>
                  )
                })
              );
            })
          }
          {/* {Object.entries(standingsFormatted).map(([colName, colValues]) => (
            <div className="" key={colName}>
              {colValues.map((value, i) => {
                const constructorId = standings?.standings[i]?.constructor.id ?? null;
                return (
                  <div
                    className={`cells ${colName === 'CONSTRUCTOR' ? 'cursor-pointer' : ''}`}
                    key={i}
                    onClick={
                      colName === 'CONSTRUCTOR'
                        ? () => props.onConstructorClick(Number(constructorId), String(value))
                        : undefined
                    }
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          ))} */}
        </div>
      </div>
      </div>
    </>
  );
}



// import { useState, useEffect } from 'react';
// import { DatePicker } from '../DatePicker';
// import './index.css';

// import BACKEND_URL from '../../backend_url'; 

// const startDate = new Date("2024"); // Until we get current standings

// interface Constructor {
//     id:             number
//     constructorRef: string | null
//     name:           string | null
//     nationality:    string | null
//     url:            string | undefined
// }

// interface ConstructorStanding {
//     raceId:       number
//     position:     number | null
//     points:       number | null
//     wins:         number | null
//     constructor:  Constructor
// } 

// interface Standings {
//     season:    number
//     lastRace:  string
//     standings: ConstructorStanding[]
// }

// interface StandingsFormatted {
//     //Cols
//     "POS.":        (number | string | null)[];       
//     "CONSTRUCTOR": (string | string | null)[];
//     "NATIONALITY": (string | string | null)[];
//     "WINS":        (number | string | null)[];
//     "PTS.":        (number | string | null)[];

//     [key: string]: (number | string | null)[]; // Index signature
// }

// interface Props {
//     //This means: “Parent must give me a function that accepts a number and returns nothing (void).”
//     onConstructorClick: (constructorId: number, constructorName: string) => void;
// }


// async function fetchStandings(season: number): Promise<Standings | null> {
//     try {
//         const res = await fetch(`${BACKEND_URL}/api/constructorStandings?year=${season}`);
//         //const res = await fetch(`http://localhost:3001/api/driver?id=${id}`);
//         if (!res.ok) throw new Error("Failed to fetch driver");

//         // This can be written as: "return res.json() as Promise<Driver>;"
//         const data: Standings = await res.json();
//         return data;

//     } catch (err) {
//         console.error(`Error fetching season from year: ${season}`, err);
//         return null;
//     }
// }

// export function ConstructorStandings(props: Props){
//     const [standings, setStandings] = useState<Standings| null>(null);
//     const [selectedYear, setSelectedYear] = useState<Date | null>(startDate);

// //     useEffect(() => {
// //   console.log("DriverStandings mounted");
// //   return () => console.log("DriverStandings unmounted");
// // }, []);
    
//     useEffect(() => {
//         const loadStandings = async () => {
//             if (selectedYear === null) {
//                 setStandings(null);
//                 return;
//             }
//             const fetchedStandings = await fetchStandings(Number(selectedYear?.getFullYear()));
//             setStandings(fetchedStandings);
//         };
//         loadStandings();
//     }, [selectedYear]);



//     const standingsFormatted: StandingsFormatted = {
//         // Convert to cols
//         "POS.":        standings?.standings.map(item => item.position                ?? '--')   ?? [],
//         "CONSTRUCTOR": standings?.standings.map(item => `${item.constructor.name     ?? '--'}`) ?? [],
//         "NATIONALITY": standings?.standings.map(item => item.constructor.nationality ?? '--')   ?? [],
//         "WINS":        standings?.standings.map(item => item.wins                    ?? '--')   ?? [],
//         "PTS.":        standings?.standings.map(item => item.points                  ?? '--')   ?? [],

//     };
//     const columnSize = Object.keys(standingsFormatted).length;

//     return (
//     <div className="gridChildContent constructorStandingsContent primaryContent
//     p-4
//     ">
//       <div className="header">
//         <h1>Constructor Standings</h1>
//         <DatePicker onDateChange={setSelectedYear} startDate={startDate} />
//       </div>

//       <div
//         id="standingsTable"
//         className="standingsTable"
//         style={{ gridTemplateColumns: `repeat(${columnSize}, auto)` }}
//       >
//         <div className="tableHeaderRow">POS.</div>
//         <div className="tableHeaderRow">CONSTRUCTOR</div>
//         <div className="tableHeaderRow">NATIONALITY</div>
//         <div className="tableHeaderRow">WINS</div>
//         <div className="tableHeaderRow">PTS.</div>

//         {Object.entries(standingsFormatted).map(([colName, colValues]) => (
//           <div className="standingsColumns" key={colName}>
//             {colValues.map((value, i) => {
//               const constructorId = standings?.standings[i]?.constructor.id ?? null;
//               return (
//                 <div
//                   className={`cells ${colName === 'CONSTRUCTOR' ? 'cursor-pointer' : ''}`}
//                   key={i}
//                   onClick={
//                     colName === 'CONSTRUCTOR'
//                       ? () => props.onConstructorClick(Number(constructorId), String(value))
//                       : undefined
//                   }
//                 >
//                   {value}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }