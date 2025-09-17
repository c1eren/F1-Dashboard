import { useState, useEffect } from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/table";
import { DriverStatsBox } from '../driverStats/driverStatsNew'; 
import { MyDatePicker } from './datePicker';
import { Card, CardBody } from "@heroui/react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface Driver {
  id: number
  name: string
  code: string | null
  nationality: string
}

interface Standing {
  position: number
  points: number
  wins: number
  driver: Driver
}

interface StandingsResponse {
  season: number
  race: string
  standings: Standing[]
}

function StandingsTable() { // Year gotta be a number
  const [standings, setStandings] = useState<Standing[]>([]);
  const [raceName, setRaceName]   = useState<string>("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null); // Track selected driver
  const [year, setYear] = useState<number>(2021); // Default -> one of the BEST years in f1 history
  
  useEffect(() => {
    fetch(`${backendUrl}/api/currentDriverStandings?year=${year}`)
    //fetch(`http://localhost:3001/api/currentDriverStandings?year=${year}`)
      .then(res => res.json())
      .then((data: StandingsResponse) => {
        setStandings(data.standings)
        setRaceName(data.race)
      })
      .catch(err => console.error(err))
  }, [year]) // re-run whenever `year` changes

  return (
    // Headers
      <div className='flex gap-10'>
        <div>

          <div className="flex items-center justify-left p-4 gap-5 bg-white dark:bg-gray-800 rounded-lg shadow mb-4">

            <div>
              <h3 className="text-xl font-bold">{year}</h3>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-300">
                Latest Race: {raceName}
              </span>
              <div className="w-auto p-1 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700">
                <MyDatePicker onYearChange={(y) => y && setYear(y)} />
              </div>
            </div>
            
          </div>
          <div className="flex gap-10">
            <div className='w-auto'>
              <Card className="w-[600px] h-[600px] overflow-y-auto">
                <CardBody className='scrollbar-thin'>
                  <Table aria-label="Driver Standings Table"> 
                    <TableHeader>
                      <TableColumn>Pos</TableColumn>
                      <TableColumn>Driver</TableColumn>
                      <TableColumn>Points</TableColumn>
                      <TableColumn>Wins</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {standings.map(ds => (
                        // Give onClick function to bring up Driver Stats
                        <TableRow key={ds.driver.id} className="cursor-pointer hover:bg-gray-100" onClick={() => setSelectedDriver(ds.driver)}>
                          <TableCell>{ds.position}</TableCell>
                          <TableCell>{ds.driver.name}</TableCell>
                          <TableCell>{ds.points}</TableCell>
                          <TableCell>{ds.wins}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </div>

            <div className={`transition-opacity duration-300 ${selectedDriver ? 'opacity-100' : 'opacity-0'}`}>
              <DriverStatsBox driver={selectedDriver} />
            </div>
          </div>
        </div>        
      </div>
  );
}

export {StandingsTable};