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

export function TableDriverInfoController({driverInfoList,setDriverInfoList,}: TableDriverInfoControllerProps) 
{ 
  // TODO
  function handleConstructorClick(){}

  // Handler for clicking a driver in the standings
  const handleDriverClick = (driverId: number, driverName: string) => {
    // This lambda resolves to a driverInfoList item, filling the setDriverInfoList brackets with the "new" value for driverInfoList
    setDriverInfoList(prev => {
      if (prev.some(d => d.selectedDriver === driverId)) return prev;
      return [...prev, { selectedDriver: driverId, driverName }];
    });
  };

  return (
      <>
        <div id='Next Session' className="gridChild nextSession
        w-[975px] h-[200px]
        ">
          <NextSession/>
        </div>
        
        <div id='Constructor Standings' className='gridChild constructorStandings 
        
        '>
          <ConstructorStandings onConstructorClick={handleConstructorClick} />
        </div>

        <div id='Driver Standings' className='gridChild driverStandings'>
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
