import { DriverInfo } from '../DriverInfo';
import { DriverStandings } from '../DriverStandings';
import { NextSession } from '../NextSession';
import { ConstructorStandings } from '../ConstructorStandings';


interface DriverInfoProps {
  selectedDriver: number | null;
  driverName: string;
}
interface TableDriverInfoControllerProps {
  driverInfoList: DriverInfoProps[];
  setDriverInfoList: React.Dispatch<React.SetStateAction<DriverInfoProps[]>>; // StateSetter longform type T
}

export function TableDriverInfoController({driverInfoList,setDriverInfoList,}: TableDriverInfoControllerProps) { 

  // TODO
  function handleConstructorClick(){}
  
  // Handler for clicking a driver in the standings
  const handleDriverClick = (driverId: number, driverName: string) => {
    // Avoid duplicates if needed, do I want to enable duplicates? probably not?? leave it for now
  
    // This lambda resolves to a driverInfoList item, filling the setDriverInfoList brackets with the "new" value for driverInfoList
    setDriverInfoList(prev => {
      if (prev.some(d => d.selectedDriver === driverId)) return prev;
      return [...prev, { selectedDriver: driverId, driverName }];
    });
  };

  return (
      <>
        <div id='nextSession' className="gridChild nextSession">
          <NextSession/>
        </div>
        
        <div id='constructorStandings' className='gridChild constructorStandings 
        w-[500px] h-[350px]
        '>
          <ConstructorStandings onConstructorClick={handleConstructorClick} />
        </div>

        <div id='driverStandings' className='gridChild driverStandings'>
          <DriverStandings onDriverClick={handleDriverClick} />
        </div>

        {/* Render each driverInfo by passing in and mapping driverInfoList */}
        {driverInfoList.map(driverInfo =>(
            <div key={driverInfo.selectedDriver} data-type="driverInfo" id={`${driverInfo.driverName}`} className='gridChild driverInfo'>
              <DriverInfo selectedDriver={driverInfo.selectedDriver} selectedDriverName={driverInfo.driverName}/>
            </div>
        ))}
      </>
  );
}
