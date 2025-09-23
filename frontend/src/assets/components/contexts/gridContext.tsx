import {createContext, useContext} from "react"; // Context basically gives scoped variable use 

interface GridContextType {
    cellWidth: number;
    cellHeight: number;
}

export const GridContext = createContext<GridContextType | null>(null); // Creates a context object

export const useGrid = ()=>{
    const context = useContext(GridContext); // Grabs the current values for this context
    if (!context)
        throw new Error("useGrid must be inside a GridContainer"); // If null throw error
    return context;
}