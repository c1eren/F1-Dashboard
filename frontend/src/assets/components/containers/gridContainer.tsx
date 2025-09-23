import { type ReactNode, useRef, useEffect, useState} from "react"; 
import { GridContext } from "../contexts/gridContext";


interface Props {
    children: ReactNode; // Anything react can render
    columns?: number;
       rows?: number;
}

export function GridContainer({children, columns = 200, rows = 200}: Props) {
    const containerRef = useRef<HTMLDivElement>(null); // Point to GridContainer div
    const [cellSize, setCellSize] = useState({ cellWidth: 0, cellHeight: 0 });

    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect(); // Gets width and height from element relative to viewport
            setCellSize({cellWidth: width/columns, cellHeight: height/rows});
        }
    }, [columns, rows]); // Will execute once initially and then only if columns or rows changes

    // Provider gives cellSize value to all child elements (like they're in scope)
    return (
        <GridContext.Provider value={cellSize}>
            <div
            ref = {containerRef}
            className="outline grid gap-2 w-screen h-screen"
            style={{
                gridTemplateColumns: `repeat(autofit, ${columns}, 1fr)`,
                gridTemplateRows: `repeat(autofit,${rows}, 1fr)`,
            }}>
                {children}
            </div>
        </GridContext.Provider>
    );
}