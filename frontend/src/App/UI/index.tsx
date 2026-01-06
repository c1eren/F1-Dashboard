import './index.css';

interface DriverInfoProps {
  selectedDriver: number | null;
  driverName: string;
}
interface UIContainerProps {
  driverInfoList: DriverInfoProps[];
  setDriverInfoList: React.Dispatch<React.SetStateAction<DriverInfoProps[]>>; // StateSetter longform type T
}

const componentNames:string[] = [
  "Next Session",
  "Driver Standings",
  "Constructor Standings",
];

export function UIContainer(
  {driverInfoList,setDriverInfoList}: UIContainerProps,
) {

  const handleCloseDriver = (driverInfo: DriverInfoProps) => {
        setDriverInfoList(prev => prev.filter(d => d.selectedDriver !== driverInfo.selectedDriver));
    };

    return (
        <div className='UIContainer'>

          <div className='UICol'>

              {/* Could dynamically add these options on init to allow for any set of cellSize options */}
              <label className='UIItem'>Cell size
              <select id="cellSizeOption" name="cellOptions" defaultValue={"25"} className='w-full'>
                <option value="10">10px</option>
                <option value="25">25px</option> {/* Default selection */}
                <option value="50">50px</option>
                <option value="100">100px</option>
              </select>
              </label>
            
            <div id="buttons" className='buttons UIItem'>
              Windows
              {componentNames.map(name =>(
                <div key={name} data-type="gridChildButton" id={`${name}Button`} 
                className='flex p-2'>
                  <div className='flex-1'> {name} </div>
                </div>
              ))}
            </div>

            <div id="driverInfoButtons" className='buttons UIItem'>
              Driver Info
              {driverInfoList.map(driverInfo =>(
                <div key={driverInfo.selectedDriver} data-type="driverInfoButton" id={`${driverInfo.driverName}Button`} 
                className='flex p-2'>
                  {/* This is the closing button to remove the driverInfo gridChild from the render list */}
                  <div className='flex-1'> {driverInfo.driverName} </div>
                  <div className="h-full" onClick={() => handleCloseDriver(driverInfo)}>
                    ✕
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
    );
}