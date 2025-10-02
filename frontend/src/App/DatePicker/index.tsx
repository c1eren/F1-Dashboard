import { useState } from "react";
import DatePickerImport from "react-datepicker";
import "./index.css"

interface Props {
    onDateChange: (date: Date | null) => void;
    startDate: (Date);
}

export function DatePicker(props: Props) {
    //const currentDate = new Date();   TODO: Auto fill db with current year standings + export and replace relevant csv res' every update 
    const currentDate = new Date();
    const minimumDate = new Date("1950");

    const [selectedDate, setSelectedDate] = useState<Date | null>(props.startDate);
    console.log("selectedDate:" + selectedDate);

    return (
        <div>
            <DatePickerImport
            className="border"
            showIcon 
            toggleCalendarOnIconClick
            selected={selectedDate} 
            showYearPicker
            dateFormat={"yyyy"}
            yearItemNumber={10}
            minDate={minimumDate}
            maxDate={currentDate}
            onChange={(date: Date | null) => { setSelectedDate(date); props.onDateChange(date);}} 
            />
        </div>
    );
}