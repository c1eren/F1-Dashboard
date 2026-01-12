import { DriverInfo } from '../DriverInfo';
import { ConstructorInfo } from '../ConstructorInfo';
import { DriverStandings } from '../DriverStandings';
import { NextSession } from '../NextSession';
import { ConstructorStandings } from '../ConstructorStandings';


interface InfoProps {
  selected: number | null;
  name: string;
}

interface Props {
  driverInfoList:         InfoProps[];
  constructorInfoList:    InfoProps[];
  setDriverInfoList:      React.Dispatch<React.SetStateAction<InfoProps[]>>;
  setConstructorInfoList: React.Dispatch<React.SetStateAction<InfoProps[]>>;
}

export function TableDriverInfoController({driverInfoList,constructorInfoList,setDriverInfoList,setConstructorInfoList}: Props) 
{ 
  const handleInfoClick = (
  id: number,
  name: string,
  type: 'driver' | 'constructor'
  ) => {
    if (type === 'driver') {
      setDriverInfoList(prev => {
        if (prev.some(d => d.selected === id)) return prev;
        return [...prev, { selected: id, name }];
    });
    } else {
      setConstructorInfoList(prev => {
        if (prev.some(c => c.selected === id)) return prev;
        return [...prev, { selected: id, name }];
      });
    }
  };

  return (
      <>
        <div id='Next Session' className="gridChild nextSession">
          <NextSession/>
        </div>
        
        <div id='Constructor Standings' className='gridChild constructorStandings'>
          <ConstructorStandings onConstructorClick={handleInfoClick} />
        </div>

        <div id='Driver Standings' className='gridChild driverStandings'>
          <DriverStandings onDriverClick={handleInfoClick} />
        </div>

        {/* Render each driverInfo by passing in and mapping driverInfoList */}
        {driverInfoList.map(driverInfo =>(
            <div key={driverInfo.selected} data-type="standardInfo" id={`${driverInfo.name}`} className='gridChild standardInfo'>
              <DriverInfo selectedDriver={driverInfo.selected} selectedDriverName={driverInfo.name}/>
            </div>
        ))}
        {constructorInfoList.map(constructorInfo =>(
            <div key={constructorInfo.selected} data-type="standardInfo" id={`${constructorInfo.name}`} className='gridChild standardInfo'>
              <ConstructorInfo selectedConstructor={constructorInfo.selected} selectedConstructorName={constructorInfo.name}/>
            </div>
        ))}
      </>
  );
}
