import {useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface MyDatePickerProps { // Works similar to C# interface
    onYearChange: (year: number | null) => void;
}

function MyDatePicker({ onYearChange }: MyDatePickerProps) { // Pull onYearChange from props
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleChange = (date: Date | null) => {
        setSelectedDate(date);
        onYearChange(date ? date.getFullYear() : null);

    };

    const minYear     = 1950; // Earliest f1 year
    const currentYear = new Date().getFullYear();

    // Render with config
    return (
        <DatePicker
        selected = {selectedDate}
        onChange = {handleChange}
        showYearPicker
        dateFormat = "yyyy"     // Only need the year for this one
        placeholderText="Select a year"
        minDate = {new Date(minYear, 0, 1)}
        maxDate = {new Date(currentYear, 11, 31)}
        />
    );
}


export {MyDatePicker};
