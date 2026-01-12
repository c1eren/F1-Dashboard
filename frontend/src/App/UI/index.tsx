import './index.css';

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

const componentNames:string[] = [
  "Next Session",
  "Driver Standings",
  "Constructor Standings",
];

export function UIContainer({driverInfoList, constructorInfoList, setDriverInfoList, setConstructorInfoList}: Props,) {
  
  const handleCloseInfo = (info: InfoProps, type: "driver"|"constructor") => {
    if (type === 'driver')
        setDriverInfoList(prev => prev.filter(d => d.selected !== info.selected));
    else if (type === 'constructor')
      setConstructorInfoList(prev => prev.filter(c => c.selected !== info.selected));
    else
      return;
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
                className='flex p-2 cursor-pointer'>
                  <div className='flex-1'> {name} </div>
                </div>
              ))}
            </div>

            <div id="driverInfoButtons" className='buttons UIItem'>
              Driver Info
              {driverInfoList.map(driverInfo =>(
                <div key={driverInfo.selected} data-type="driverInfoButton" id={`${driverInfo.name}Button`} 
                className='flex p-2 cursor-pointer'>
                  {/* This is the closing button to remove the driverInfo gridChild from the render list */}
                  <div className='flex-1'> {driverInfo.name} </div>
                  <div className="driverInfoCloseButton h-fit" onClick={() => handleCloseInfo(driverInfo, 'driver')}>
                    ✕
                  </div>
                </div>
              ))}
            </div>
            <div id="constructorInfoButtons" className='buttons UIItem'>
              Constructor Info
              {constructorInfoList.map(constructorInfo =>(
                <div key={constructorInfo.selected} data-type="constructorInfoButton" id={`${constructorInfo.name}Button`} 
                className='flex p-2 cursor-pointer'>
                  {/* This is the closing button to remove the constructorInfo gridChild from the render list */}
                  <div className='flex-1'> {constructorInfo.name} </div>
                  <div className="constructorInfoCloseButton h-fit" onClick={() => handleCloseInfo(constructorInfo, 'constructor')}>
                    ✕
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
    );
}