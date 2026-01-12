import { useState, useEffect } from 'react';
import BACKEND_URL from '../../backend_url'; 

function RenderHTML(htmlString : string) {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
}

interface Constructor {

    // From DB
    id:          number
    constructorRef:   string | null
    number:      number | null
    code:        string | null
    constructorName:        string | null
    nationality: string | null
    url:         string | undefined
    // From wiki
    title:       string | null
    description: string | null
    extract:     string | null   
    image:       string | undefined
}

interface Props {
    selectedConstructor: number | null
    selectedConstructorName: string | null
}

async function fetchConstructor(id: number | null, dName: string | null) : Promise<Constructor | null> {
    try {
        const res = await fetch(`${BACKEND_URL}/api/constructor?id=${Number(id)}&name=${String(dName)}`);
        if (!res.ok) throw new Error("Failed to fetch constructor");
        const data: Constructor = await res.json();
        return data;
    } catch (err) {
        console.error(`Error fetching constructor at id: ${id}`, err);
        return null;
    }
}

export function ConstructorInfo({ selectedConstructor, selectedConstructorName }: Props) {
    const [constructor, setConstructor] = useState<Constructor | null>(null);

    useEffect(() => {
        const loadConstructor = async () => {
            if (selectedConstructor === null) {
                setConstructor(null);
                return;
            }
            const fetchedConstructor = await fetchConstructor(selectedConstructor, selectedConstructorName);
            // console.log(fetchedConstructor);
            setConstructor(fetchedConstructor);
        };
        loadConstructor();
    }, [selectedConstructor, selectedConstructorName]);

    if (selectedConstructor === null) return <p>Select a constructor</p>;
    if (!constructor) return <p>Loading...</p>;

    const constructorData = [
        { header: "Number", value: constructor.number },
        { header: "Code", value: constructor.code },
        { header: "Nationality", value: constructor.nationality },
    ].filter(item => item.value != null && item.value !== '');


    return (
    <>
        <div id={String()} className="gridChildContent flex flex-col h-full min-h-0">
            <h1 className="">{ selectedConstructorName }</h1>
    <div>{constructor.code}</div>

            <div className="flex gap-1 flex-1 min-h-0">
                {/*  */}
                <div className='flex flex-col'>
                    <div className="grid grid-cols-2">
                        {constructorData.map((item) => (
                            <div className="cells" key={item.header}>
                                <h3>{item.header}</h3>
                                <div>{item.value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="excerpt border flex-1 min-h-0 overflow-y-auto">
                        {RenderHTML(String(constructor.extract))}
                    </div>
                </div>
                <img className='non-responsive-image h-full w-auto object-contain max-w-1/2' src={constructor.image} alt={String(selectedConstructorName)}></img>

            </div>
                    <div className="">
                        <h3>Wiki</h3>
                        <a href={String(constructor.url)} rel="noopener noreferrer" target="_blank"><p>{decodeURIComponent(String(constructor.url))}</p></a>
                    </div>
        </div>
    </>
    );
}
