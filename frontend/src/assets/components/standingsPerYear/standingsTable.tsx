import { useState, useEffect } from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/table";

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

function StandingsTable({year}: {year: number}) { // Year gotta be a number
  const [standings, setStandings] = useState<Standing[]>([]);
  const [raceName, setRaceName]   = useState<string>("");
  
  useEffect(() => {
    fetch(`http://localhost:3000/api/currentDriverStandings?year=${year}`)
      .then(res => res.json())
      .then((data: StandingsResponse) => {
        setStandings(data.standings)
        setRaceName(data.race)
      })
      .catch(err => console.error(err))
  }, [year]) // re-run whenever `year` changes

  return (
    // Build table using {year}
    <div>
      <h1>Driver Standings for {year}</h1>
      <h2>Latest Race: {raceName}</h2>

      <Table aria-label="Driver Standings Table">
        <TableHeader>
            <TableColumn>Pos</TableColumn>
            <TableColumn>Driver</TableColumn>
            <TableColumn>Points</TableColumn>
            <TableColumn>Wins</TableColumn>
        </TableHeader>
        <TableBody>
          {standings.map(ds => (
            <TableRow key={ds.driver.id}>
              <TableCell>{ds.position}</TableCell>
              <TableCell>{ds.driver.name}</TableCell>
              <TableCell>{ds.points}</TableCell>
              <TableCell>{ds.wins}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export {StandingsTable};