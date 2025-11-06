import './grid.css'
import { useEffect } from 'react';
import { TableDriverInfoController } from './Controller/controller';
import { NextSession } from './NextSession';

function App() {
  // Wait till app mounts

  useEffect(() => {
    //@ts-expect-error Ihateyoutypescript
    import('./grid.js');
  }, []);

  return (
    <>
    <div className='main flex max-w-screen max-h-screen overflow-hidden '>
      <div className='UIContainer'>

        {/* <div className='UIRow col-span-2 h-20 bg-gradient-to-r from-green-300 to-emerald-500 flex 
                        items-center justify-center text-5xl font-bold'>
          <span>F1 Dashboard</span>
        </div> */}

        <div className='UICol py-10 px-2 h-screen w-40 bg-gradient-to-l from-gray-900 to-gray-850 flex items-start justify-center text-5xl font-bold'>
            {/* <label htmlFor="cellOptions" className='border w-full text-sm rounded-sm bg-transparent'>beans</label> */}
            <select id="cellSizeOption" name="cellOptions" className='border w-full text-sm rounded-sm bg-gray-900'>
              <option value="">Cell size these options tags are awful</option>
              <option value="10">10px</option>
              <option value="50">50px</option>
              <option value="100">100px</option>
            </select>
        </div>

      </div>

        <div className='gridContainer overflow-scroll border-2 border-pink-400'>

          <div className="gridChild min-h-[300px] min-w-[400px] sm:min-h-[300px]">
            <NextSession/>
          </div>

          <TableDriverInfoController/>

          {/* <div className='gridChild bg-amber-500 h-10 w-10'></div> */}
        </div>
    </div>
    </>
  );
}

export default App
