import type {ReactNode} from "react";

interface Props {
    children: ReactNode; // Anything react can render
}

export function FlexContainer({children}: Props) {
    return (
        <div className="flex flex-wrap outline-2 w-screen h-screen p-4 gap-4">{children}</div> /*style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",}}>{children}</div>*/
    );
}