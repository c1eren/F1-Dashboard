import { useState, useEffect } from 'react';
import { DatePicker } from '../DatePicker';
import './index.css';

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
    <div className="gridChildContent constructorStandingsContent primaryContent">
      <div className="header">
        <h1>Constructor Standings</h1>
        <DatePicker onDateChange={setSelectedYear} startDate={startDate} />
      </div>

      <div
        id="standingsTable"
        className="standingsTable"
        style={{ gridTemplateColumns: `repeat(${columnSize}, auto)` }}
      >
        <div className="tableHeaderRow">POS.</div>
        <div className="tableHeaderRow">CONSTRUCTOR</div>
        <div className="tableHeaderRow">NATIONALITY</div>
        <div className="tableHeaderRow">WINS</div>
        <div className="tableHeaderRow">PTS.</div>

        {Object.entries(standingsFormatted).map(([colName, colValues]) => (
          <div className="standingsColumns" key={colName}>
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
        ))}
      </div>
    </div>
  );
}