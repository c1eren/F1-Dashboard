import {useGrid} from '../contexts/gridContext';
import {useRef, useEffect, useState} from "react";

interface BoxProps {
    children: React.ReactNode; // Import on the fly
}

// This is so broken lol needs fixing

export function Box ({children}: BoxProps){
    const { cellWidth, cellHeight } = useGrid();
    const contentRef = useRef<HTMLDivElement>(null);
    const [span, setSpan] = useState({ col: 1, row: 1}); // Get size based on content

    useEffect(() => {
        const updateSize = () => {
            if (contentRef.current) {
                const {width, height} = contentRef.current.getBoundingClientRect(); // This box div
                setSpan({
                    col: Math.max(Math.ceil(width / cellWidth)),
                    row: Math.max(Math.ceil(height/ cellHeight)),
                });
            }
        };

    updateSize(); // Initial execute
    window.addEventListener("resize", updateSize); // Run on window resize

    return () => window.removeEventListener("resize", updateSize); // Bitta cleanup

    }, [cellWidth, cellHeight, children]);

    return (
        <div
        className="w-fit h-fit justify-center items-center border border-blue-500 p-2" 
        style={{
            gridColumn: `span ${span.col}`,
            gridRow:    `span ${span.row}`,
        }}>
            <div ref={contentRef} className='flex-wrap'>
                {children}
            </div>
        </div>
    );
}