import { useState } from "react";
import { MyDatePicker } from "./datePicker";
import { StandingsTable } from "./standingsTable";

function DriverStandingsComponent() {
    const [year, setYear] = useState<number>(2021); // Default -> one of the best years in f1 history

    return (
        <div>
            <h1>F1 Standings</h1>

            <MyDatePicker onYearChange = {(y) => y && setYear(y)} />

            <StandingsTable year = {year} />
        </div>
    );
}

export {DriverStandingsComponent};


