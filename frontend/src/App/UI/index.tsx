import './index.css';
import {toggleComponent} from '../grid.js'

interface DriverInfoProps {
  selectedDriver: number | null;
  driverName: string;
}

interface TableDriverInfoControllerProps {
  driverInfoList: DriverInfoProps[];
  setDriverInfoList: React.Dispatch<React.SetStateAction<DriverInfoProps[]>>; // StateSetter longform type T
}

export function UIContainer({
  driverInfoList,
  setDriverInfoList,
}: TableDriverInfoControllerProps) {

  const handleCloseDriver = (driverInfo: DriverInfoProps) => {
      // TODO fix!
      // const element = document.querySelector(driverInfo.driverName);
      // if (!element){return;}
      // element.classList.add("closing");
      // element.addEventListener("transitionend", () => {
        setDriverInfoList(prev => prev.filter(d => d.selectedDriver !== driverInfo.selectedDriver));
      // }, { once: true });
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
            </div>

            <div id="driverInfoButtons" className='buttons UIItem'>
              Driver Info
              </div>
              {driverInfoList.map(driverInfo =>(
                              <div key={driverInfo.selectedDriver} data-type="driverInfo" id={`${driverInfo.driverName}Button`} 
                              className='componentToggles
                              flex
                              justify-around
                              border border-white
                              '>
                                {/* This is the closing button to remove the driverInfo gridChild from the render list */}
                                <div> {driverInfo.driverName} </div>
                                <div className="h-full" onClick={() => handleCloseDriver(driverInfo)}>
                                  ✕
                                </div>
                              </div>
                          ))}

          </div>

        </div>
    );
}