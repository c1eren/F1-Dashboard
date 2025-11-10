import './index.css';
export function UIContainer() {
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

          </div>

        </div>
    );
}